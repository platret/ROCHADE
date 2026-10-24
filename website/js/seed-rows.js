/* Test data for the shared Supabase database: turns a planner project (js/data.js) into rows in
   the column shape of Alex's tables (projects, flats, households, phases). Pure functions, deterministic
   ids and codes, so the seed can be re-run: existing rows are skipped, never updated (Etappen are shifted
   in the app only). The assignments table is never produced here: it belongs to the solver in the app. */

/* Uppercase letters and digits without 0, O, 1, I, L: the codes are read from a printed letter. */
export const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const CODE_LENGTH = 6;

export const DEFAULTS = Object.freeze({
  projectId: 'f0000000-0000-4000-8000-000000000001',
  adminCode: 'W4RK7N',
  city: 'Zürich',
  schoolDistrict: 'Waidberg',
});

/* invite_code and admin_code are unique across the whole table, so the codes of the first demo project
   («Siedlung Sonnenhalde», supabase/seed.sql in the monorepo) count as taken too. */
export const RESERVED_CODES = Object.freeze([
  'V7Q3KD',
  '7KW4PD', '3HTX9M', 'Q8RZ2N', '5MPC7E', 'R2V6KX', '9DQ3TW', 'X6N8HB', '4PWY7C', 'B3H7QK', '6ZTR4M', 'P7XK2D',
]);

const UUID_PREFIX = { phases: 'f1000000', flats: 'f2000000', households: 'f3000000' };
const MAX_REROLLS = 1000;
const CODE_PATTERN = new RegExp(`^[${ALPHABET}]{${CODE_LENGTH}}$`);

export const isCode = (value) => typeof value === 'string' && CODE_PATTERN.test(value);

export const rowId = (table, n) => `${UUID_PREFIX[table]}-0000-4000-8000-${String(n).padStart(12, '0')}`;

/* FNV-1a with a final avalanche, so neighbouring ids ('H01', 'H02') do not yield neighbouring codes. */
function hash32(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) >>> 0;
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35) >>> 0;
  return (h ^ (h >>> 16)) >>> 0;
}

function encode(number) {
  const digits = [];
  let rest = number;
  for (let i = 0; i < CODE_LENGTH; i += 1) {
    digits.push(ALPHABET[rest % ALPHABET.length]);
    rest = Math.floor(rest / ALPHABET.length);
  }
  return digits.join('');
}

/** Deterministic code for a seed; collisions with `taken` are re-rolled. Does not mutate `taken`. */
export function inviteCodeFor(seed, taken = []) {
  const used = new Set([...taken].map((c) => String(c).toUpperCase()));
  for (let attempt = 0; attempt < MAX_REROLLS; attempt += 1) {
    const code = encode(hash32(attempt === 0 ? String(seed) : `${seed}#${attempt}`));
    if (!used.has(code)) return code;
  }
  throw new Error(`Kein freier Code für «${seed}» gefunden.`);
}

/* Timeline months are indexes from timeline.startMonth (1-based). Dates in UTC, so the day never shifts. */
function monthOf(timeline, index) {
  const abs = timeline.startMonth - 1 + index;
  return { year: timeline.startYear + Math.floor(abs / 12), month: ((abs % 12) + 12) % 12 };
}

const isoDate = (date) => date.toISOString().slice(0, 10);
export const firstDay = (timeline, index) => {
  const { year, month } = monthOf(timeline, index);
  return isoDate(new Date(Date.UTC(year, month, 1)));
};
export const lastDay = (timeline, index) => {
  const { year, month } = monthOf(timeline, index);
  return isoDate(new Date(Date.UTC(year, month + 1, 0)));
};

/** 'Rotbuchstrasse 12, 2. OG' -> 2, 'Parterre' or 'EG' -> 0. */
export function floorFromName(name) {
  const og = /(\d+)\.\s*OG/i.exec(name);
  if (og) return Number(og[1]);
  return 0;
}

/** 'A-02' -> 'Whg. A.02'. */
export const flatLabel = (apartmentId) => `Whg. ${apartmentId.replace('-', '.')}`;

function buildingName(project, id) {
  const building = project.buildings.find((b) => b.id === id);
  if (!building) throw new Error(`Liegenschaft «${id}» ist im Projekt nicht erfasst.`);
  return building.name;
}

function validateOptions({ projectId, adminCode }) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId)) {
    throw new Error(`Projekt-ID «${projectId}» ist keine UUID.`);
  }
  if (!isCode(adminCode)) {
    throw new Error(`Verwaltungscode «${adminCode}» muss ${CODE_LENGTH} Zeichen aus ${ALPHABET} haben.`);
  }
}

function phaseRows(project, projectId) {
  return project.phases.map((phase, i) => ({
    id: rowId('phases', i + 1),
    project_id: projectId,
    name: phase.name,
    building: buildingName(project, phase.building),
    start_date: firstDay(project.timeline, phase.start),
    end_date: lastDay(project.timeline, phase.start + phase.duration - 1),
    sort_order: i + 1,
  }));
}

/* Vacant apartments are the Rochade-Wohnungen of the Siedlung; the externals always are. */
function flatRows(project, projectId, schoolDistrict) {
  const occupied = new Set(project.households.map((h) => h.apartment));
  const apartments = project.apartments.map((a, i) => ({
    id: rowId('flats', i + 1),
    project_id: projectId,
    label: flatLabel(a.id),
    building: buildingName(project, a.building),
    floor: a.floor,
    rooms: a.rooms,
    step_free: a.stepFree,
    is_temporary: !occupied.has(a.id),
    school_district: schoolDistrict,
  }));
  const externals = (project.external ?? []).map((e, i) => ({
    id: rowId('flats', project.apartments.length + i + 1),
    project_id: projectId,
    label: e.name,
    building: 'Extern',
    floor: floorFromName(e.name),
    rooms: e.rooms,
    step_free: e.stepFree,
    is_temporary: true,
    school_district: schoolDistrict,
  }));
  return [...apartments, ...externals];
}

function householdRows(project, projectId, flatIdByApartment, { adminCode, schoolDistrict, reserved }) {
  const seedTaken = new Set([adminCode, ...reserved]);
  return project.households.reduce(({ rows, taken }, h, i) => {
    const flatId = flatIdByApartment.get(h.apartment);
    if (!flatId) throw new Error(`Haushalt «${h.name}» wohnt in der unbekannten Wohnung «${h.apartment}».`);
    const note = h.note || null;
    /* The project id is part of the seed, so two projects with the same household ids get different codes. */
    const code = inviteCodeFor(`${projectId}/${h.id}`, taken);
    const row = {
      id: rowId('households', i + 1),
      project_id: projectId,
      name: h.name,
      members: h.persons,
      home_flat_id: flatId,
      needs_rooms: h.roomsMin,
      needs_step_free: h.stepFree,
      school_district: note && note.includes(schoolDistrict) ? schoolDistrict : null,
      note,
      invite_code: code,
    };
    return { rows: [...rows, row], taken: new Set([...taken, code]) };
  }, { rows: [], taken: seedTaken }).rows;
}

/** Rows for the four tables the website may write, in the column shape of the database. */
export function buildSeedRows(project, options = {}) {
  const { projectId, adminCode, city, schoolDistrict } = { ...DEFAULTS, ...options };
  const reserved = options.reserved ?? RESERVED_CODES;
  validateOptions({ projectId, adminCode });

  const flats = flatRows(project, projectId, schoolDistrict);
  const flatIdByApartment = new Map(project.apartments.map((a, i) => [a.id, flats[i].id]));
  return {
    project: { id: projectId, name: project.name, city, admin_code: adminCode },
    phases: phaseRows(project, projectId),
    flats,
    households: householdRows(project, projectId, flatIdByApartment, { adminCode, schoolDistrict, reserved }),
  };
}

/** Postgres literal; strings are quoted with doubled apostrophes. */
export function sqlLiteral(value) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error(`Zahl «${value}» kann nicht in SQL geschrieben werden.`);
    return String(value);
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

function insertStatement(table, rows) {
  if (!rows.length) return `-- ${table}: keine Zeilen`;
  const columns = Object.keys(rows[0]);
  const values = rows.map((r) => `  (${columns.map((c) => sqlLiteral(r[c])).join(', ')})`).join(',\n');
  return `insert into public.${table} (${columns.join(', ')}) values\n${values}\non conflict (id) do nothing;`;
}

/* FK order: flats before households (home_flat_id), everything after projects. */
export const SEED_TABLES = Object.freeze(['projects', 'flats', 'households', 'phases']);

export const rowsByTable = (rows) => ({
  projects: [rows.project],
  flats: rows.flats,
  households: rows.households,
  phases: rows.phases,
});

/** Idempotent SQL for the Supabase SQL editor; the same rows the CLI inserts over REST. */
export function seedSql(rows) {
  const byTable = rowsByTable(rows);
  const header = [
    `-- ROCHADE Testdaten «${rows.project.name}», erzeugt von scripts/seed-brunnenwiese.mjs.`,
    '-- Idempotent: bestehende Zeilen bleiben unverändert (Etappen verschiebt nur die App). Keine assignments, keine Löschungen.',
  ].join('\n');
  return `${header}\n\n${SEED_TABLES.map((t) => insertStatement(t, byTable[t])).join('\n\n')}\n`;
}
