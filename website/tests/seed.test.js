import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { PROJECT } from '../js/data.js';
import { ALPHABET, CODE_LENGTH, RESERVED_CODES, buildSeedRows, inviteCodeFor, seedSql, sqlLiteral } from '../js/seed-rows.js';

const run = promisify(execFile);
const SCRIPT = new URL('../scripts/seed-brunnenwiese.mjs', import.meta.url);
const rows = buildSeedRows(PROJECT);
const codePattern = new RegExp(`^[${ALPHABET}]{${CODE_LENGTH}}$`);

test('the alphabet has no 0, O, 1, I or L and codes are six characters out of it', () => {
  assert.equal(ALPHABET.length, 31);
  for (const forbidden of ['0', 'O', '1', 'I', 'L']) assert.ok(!ALPHABET.includes(forbidden), forbidden);
  for (const h of rows.households) assert.match(h.invite_code, codePattern);
  assert.match(rows.project.admin_code, codePattern);
});

test('24 invite codes are unique, differ from the admin code and the reserved Sonnenhalde codes', () => {
  const codes = rows.households.map((h) => h.invite_code);
  assert.equal(new Set(codes).size, 24);
  assert.ok(!codes.includes(rows.project.admin_code));
  for (const reserved of RESERVED_CODES) assert.ok(!codes.includes(reserved), reserved);
});

test('the same input yields the same rows and codes', () => {
  assert.deepEqual(buildSeedRows(PROJECT), rows);
  assert.deepEqual(buildSeedRows(PROJECT, { adminCode: 'W4RK7N' }).households.map((h) => h.invite_code), rows.households.map((h) => h.invite_code));
});

test('inviteCodeFor re-rolls a taken code and leaves the taken set alone', () => {
  const first = inviteCodeFor('H01');
  const taken = new Set([first]);
  const second = inviteCodeFor('H01', taken);
  assert.notEqual(second, first);
  assert.match(second, codePattern);
  assert.deepEqual([...taken], [first]);
  assert.equal(inviteCodeFor('H01'), first);
});

test('row counts: 1 project, 3 phases, 35 flats, 24 households, no assignments', () => {
  assert.equal(rows.project.name, 'Siedlung Brunnenwiese');
  assert.equal(rows.phases.length, 3);
  assert.equal(rows.flats.length, 35);
  assert.equal(rows.households.length, 24);
  assert.ok(!('assignments' in rows));
  assert.deepEqual(Object.keys(rows).sort(), ['flats', 'households', 'phases', 'project']);
});

test('every household lives in an existing flat of the project that is not a Rochade-Wohnung', () => {
  const flats = new Map(rows.flats.map((f) => [f.id, f]));
  for (const h of rows.households) {
    const flat = flats.get(h.home_flat_id);
    assert.ok(flat, h.name);
    assert.equal(flat.project_id, rows.project.id);
    assert.equal(flat.is_temporary, false, flat.label);
  }
  assert.equal(rows.households[0].home_flat_id, rows.flats.find((f) => f.label === 'Whg. A.02').id);
});

test('phase dates follow the timeline from April 2027, inclusive end dates, leap day in 2028', () => {
  assert.deepEqual(rows.phases.map((p) => [p.name, p.building, p.start_date, p.end_date, p.sort_order]), [
    ['Etappe 1', 'Haus A', '2027-04-01', '2027-08-31', 1],
    ['Etappe 2', 'Haus B', '2027-10-01', '2028-02-29', 2],
    ['Etappe 3', 'Haus C', '2028-04-01', '2028-08-31', 3],
  ]);
  assert.deepEqual(rows.phases.map((p) => p.id), [1, 2, 3].map((n) => `f1000000-0000-4000-8000-00000000000${n}`));
});

test('is_temporary marks exactly the nine vacant apartments and the two externals', () => {
  const temporary = rows.flats.filter((f) => f.is_temporary).map((f) => f.label);
  assert.deepEqual(temporary, [
    'Whg. A.01', 'Whg. A.22', 'Whg. A.32',
    'Whg. B.01', 'Whg. B.22', 'Whg. B.32',
    'Whg. C.01', 'Whg. C.22', 'Whg. C.32',
    'Rotbuchstrasse 12, 2. OG', 'Hönggerstrasse 41, 1. OG',
  ]);
  const externals = rows.flats.filter((f) => f.building === 'Extern');
  assert.deepEqual(externals.map((f) => f.floor), [2, 1]);
  assert.deepEqual(externals.map((f) => f.id), ['f2000000-0000-4000-8000-000000000034', 'f2000000-0000-4000-8000-000000000035']);
});

test('flat and household columns follow the database shape', () => {
  const a02 = rows.flats.find((f) => f.label === 'Whg. A.02');
  assert.deepEqual(a02, {
    id: 'f2000000-0000-4000-8000-000000000002',
    project_id: rows.project.id,
    label: 'Whg. A.02',
    building: 'Haus A',
    floor: 0,
    rooms: 3.5,
    step_free: true,
    is_temporary: false,
    school_district: 'Waidberg',
  });
  const keller = rows.households.find((h) => h.name === 'Fam. Keller');
  assert.equal(keller.members, 4);
  assert.equal(keller.needs_rooms, 4.5);
  assert.equal(keller.needs_step_free, false);
  assert.equal(keller.school_district, 'Waidberg');
  const huber = rows.households.find((h) => h.name === 'Frau Huber');
  assert.equal(huber.note, null);
  assert.equal(huber.school_district, null);
});

test('options are validated: admin code and project id', () => {
  assert.throws(() => buildSeedRows(PROJECT, { adminCode: 'V7Q3K0' }), /Verwaltungscode/);
  assert.throws(() => buildSeedRows(PROJECT, { projectId: 'nope' }), /UUID/);
});

test('seedSql inserts the four tables in FK order, never updates existing rows, escapes strings and never mentions assignments', () => {
  const sql = seedSql(rows);
  const order = ['projects', 'flats', 'households', 'phases'].map((t) => sql.indexOf(`insert into public.${t} (`));
  assert.ok(order.every((i) => i >= 0));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
  assert.equal((sql.match(/on conflict \(id\) do nothing;/g) ?? []).length, 4);
  assert.ok(!/\bdo update\b|\bexcluded\./i.test(sql), 'a re-run must not move Etappen or overwrite app-side edits');
  assert.ok(!sql.includes('assignments ('));
  assert.ok(!/\bdelete\b/i.test(sql));
  assert.ok(sql.includes("'2028-02-29'"));
  assert.equal(sqlLiteral("Hr. O'Brien"), "'Hr. O''Brien'");
  assert.equal(sqlLiteral(null), 'null');
  assert.equal(sqlLiteral(true), 'true');
  assert.equal(sqlLiteral(2.5), '2.5');
});

test('the CLI dry run writes the SQL file, prints the summary and never prints the key', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'rochade-seed-'));
  const out = join(dir, 'seed.sql');
  const env = { ...process.env, SUPABASE_URL: 'https://example.invalid', SUPABASE_KEY: 'GEHEIM-NIE-AUSGEBEN' };
  const { stdout, stderr } = await run(process.execPath, [new URL(SCRIPT).pathname, '--dry-run', '--out', out], { env });
  assert.equal(stderr, '');
  assert.match(stdout, /Siedlung Brunnenwiese/);
  assert.match(stdout, /Verwaltungscode: W4RK7N/);
  assert.match(stdout, /35 Wohnungen \(davon 11 Rochade-Wohnungen\), 24 Haushalte, 3 Etappen/);
  assert.match(stdout, /Probelauf/);
  assert.ok(!stdout.includes('GEHEIM'));
  assert.equal(await readFile(out, 'utf8'), seedSql(rows));
});

test('the CLI rejects unknown options with a German message', async () => {
  await assert.rejects(run(process.execPath, [new URL(SCRIPT).pathname, '--delete']), (error) => {
    assert.equal(error.code, 1);
    assert.match(error.stderr, /Unbekannte Option --delete/);
    return true;
  });
});
