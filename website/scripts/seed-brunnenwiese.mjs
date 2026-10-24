#!/usr/bin/env node
/* Seeds the second demo project «Siedlung Brunnenwiese» into the shared Supabase database.
   Without --write it is a dry run: summary on stdout and supabase/seed_brunnenwiese.sql on disk, no network.
   With --write the same rows are inserted over PostgREST (projects, flats, households, phases; never
   assignments, never a delete) and the counts per table are read back. Create-only: rows that already
   exist are left alone, so a re-run never overwrites Etappen the app has shifted or households the
   Verwaltung has edited there. The key is read from the environment or js/env.js and never printed. */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROJECT } from '../js/data.js';
import { buildSeedRows, rowsByTable, seedSql, SEED_TABLES } from '../js/seed-rows.js';
import { request } from '../js/supabase.js';

const ENV_FILE = new URL('../js/env.js', import.meta.url);
const DEFAULT_OUT = new URL('../supabase/seed_brunnenwiese.sql', import.meta.url);
const PREVIEW_CODES = 5;
const PREFER_CREATE_ONLY = 'resolution=ignore-duplicates,return=minimal';

const HELP = `Testdaten «Siedlung Brunnenwiese» für die ROCHADE-Datenbank

  node scripts/seed-brunnenwiese.mjs [--dry-run] [--out <datei>]   Probelauf: Zusammenfassung und SQL-Datei, kein Netz
  node scripts/seed-brunnenwiese.mjs --write [--out <datei>]       Neue Zeilen per REST in die Datenbank schreiben
  node scripts/seed-brunnenwiese.mjs --help

Schreibt die Tabellen projects, flats, households und phases, nie assignments, löscht nichts.
Bestehende Zeilen bleiben unverändert: Etappen werden nur in der App verschoben.
SUPABASE_URL und SUPABASE_KEY kommen aus der Umgebung oder aus js/env.js und werden nie ausgegeben.`;

function parseArgs(argv) {
  const out = argv.indexOf('--out');
  return {
    help: argv.includes('--help') || argv.includes('-h'),
    write: argv.includes('--write'),
    outFile: out >= 0 ? argv[out + 1] : null,
    unknown: argv.filter((a, i) => a.startsWith('-') && !['--help', '-h', '--write', '--dry-run', '--out'].includes(a) && argv[i - 1] !== '--out'),
  };
}

/* The two exported strings are parsed with a regex: env.js is an ES module meant for the browser. */
async function loadEnv() {
  const fromProcess = { url: process.env.SUPABASE_URL, key: process.env.SUPABASE_KEY };
  if (fromProcess.url && fromProcess.key) return { SUPABASE_URL: fromProcess.url, SUPABASE_KEY: fromProcess.key };
  const source = await readFile(ENV_FILE, 'utf8').catch(() => '');
  const pick = (name) => source.match(new RegExp(`export\\s+const\\s+${name}\\s*=\\s*(['"\`])([^'"\`]+)\\1`))?.[2];
  const env = { url: fromProcess.url || pick('SUPABASE_URL'), key: fromProcess.key || pick('SUPABASE_KEY') };
  if (!env.url || !env.key) {
    throw new Error('SUPABASE_URL und SUPABASE_KEY fehlen: als Umgebungsvariablen setzen oder in js/env.js exportieren.');
  }
  return { SUPABASE_URL: env.url, SUPABASE_KEY: env.key };
}

function summary(rows, outPath) {
  const temporary = rows.flats.filter((f) => f.is_temporary).length;
  const codes = rows.households.slice(0, PREVIEW_CODES).map((h) => `${h.name} ${h.invite_code}`).join(', ');
  return [
    `${rows.project.name} (${rows.project.id}), ${rows.project.city}`,
    `  Verwaltungscode: ${rows.project.admin_code}`,
    `  Zeilen: 1 Projekt, ${rows.flats.length} Wohnungen (davon ${temporary} Rochade-Wohnungen), ${rows.households.length} Haushalte, ${rows.phases.length} Etappen`,
    `  Einladungscodes (erste ${PREVIEW_CODES}): ${codes}`,
    `  SQL geschrieben: ${outPath}`,
  ].join('\n');
}

/* Node's fetch only says «fetch failed»; the cause (DNS, TLS, refused) is what helps. */
async function fetchWithCause(url, init) {
  try {
    return await fetch(url, init);
  } catch (error) {
    throw new Error(error.cause?.message ?? error.message);
  }
}

/* Every call goes through request() so the website's guard rails (no deletes, no assignments,
   no shifting of Etappen) hold for the script too. */
const call = (env, path, options = {}) => request(path, { ...options, env, fetchImpl: fetchWithCause });

async function insertRows(env, table, body) {
  try {
    await call(env, `${table}?on_conflict=id`, { method: 'POST', body, prefer: PREFER_CREATE_ONLY });
  } catch (error) {
    throw new Error(`Schreiben in «${table}» fehlgeschlagen: ${error.message}`);
  }
}

/* projects has no project_id column, there the row itself is filtered. */
async function countRows(env, table, projectId) {
  const filter = table === 'projects' ? `id=eq.${projectId}` : `project_id=eq.${projectId}`;
  const found = await call(env, `${table}?select=id&${filter}`);
  return Array.isArray(found) ? found.length : 0;
}

async function writeToDatabase(rows) {
  const env = await loadEnv();
  const byTable = rowsByTable(rows);
  for (const table of SEED_TABLES) {
    await insertRows(env, table, byTable[table]);
    console.log(`  ${table}: ${byTable[table].length} Zeilen gesendet, bestehende unverändert`);
  }
  console.log('Kontrolle (Zeilen in der Datenbank für dieses Projekt):');
  for (const table of SEED_TABLES) {
    console.log(`  ${table}: ${await countRows(env, table, rows.project.id)}`);
  }
}

async function main(argv) {
  const args = parseArgs(argv);
  if (args.help) {
    console.log(HELP);
    return;
  }
  if (args.unknown.length) throw new Error(`Unbekannte Option ${args.unknown.join(', ')}. Hilfe mit --help.`);

  const rows = buildSeedRows(PROJECT);
  const outPath = resolve(args.outFile ?? fileURLToPath(DEFAULT_OUT));
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, seedSql(rows), 'utf8');
  console.log(summary(rows, outPath));

  if (!args.write) {
    console.log('Probelauf, nichts in die Datenbank geschrieben. Mit --write werden neue Zeilen gespeichert, bestehende bleiben unverändert.');
    return;
  }
  console.log('Schreibe in die Datenbank:');
  await writeToDatabase(rows);
  console.log('Fertig. Die Zuteilungen (assignments) berechnet der Solver der App.');
}

main(process.argv.slice(2)).catch((error) => {
  console.error(`Fehler: ${error.message}`);
  process.exit(1);
});
