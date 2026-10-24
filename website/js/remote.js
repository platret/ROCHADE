/* From the database rows to the planner's project model. toProject is pure; only loadRemoteProject fetches.
   Buildings get short positional keys (B1, B2, …) because planner, stage and URL use building ids as attribute
   values; apartments keep their uuid as id and carry the printed label separately, which the views must show. */
import { scheduleProject } from './schedule.js';
import { loadProjectData } from './supabase.js';

const EXTERNAL_BUILDING = /^extern/i;
const LABEL_PREFIX = /^Whg\.\s*/i;

const yearMonth = (date) => {
  const m = /^(\d{4})-(\d{2})/.exec(String(date ?? ''));
  return m ? { year: Number(m[1]), month: Number(m[2]) } : null;
};

/** Whole months from the timeline start to an ISO date (negative before the start), null for no date. */
export function monthIndexOf(timeline, date) {
  const d = yearMonth(date);
  return d ? (d.year - timeline.startYear) * 12 + (d.month - timeline.startMonth) : null;
}

const byPhaseOrder = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || String(a.start_date).localeCompare(String(b.start_date));

/* The timeline starts with the earliest Etappe; without Etappen with the current month. */
function timelineStart(phases) {
  const starts = phases.map((p) => yearMonth(p.start_date)).filter(Boolean);
  if (!starts.length) {
    const now = new Date();
    return { startYear: now.getFullYear(), startMonth: now.getMonth() + 1 };
  }
  const first = starts.reduce((a, b) => (a.year * 12 + a.month <= b.year * 12 + b.month ? a : b));
  return { startYear: first.year, startMonth: first.month };
}

const isExternal = (building) => EXTERNAL_BUILDING.test(String(building ?? '').trim());
const unique = (list) => [...new Set(list)];
const lastWord = (name) => String(name ?? '').trim().split(/\s+/).pop() || '';
const stripLabel = (label) => String(label ?? '').replace(LABEL_PREFIX, '');

function toBuilding(name, key, flats, phase, timeline) {
  const own = flats.filter((f) => f.building === name);
  const building = {
    id: key,
    name,
    street: '',
    built: null,
    lift: own.some((f) => Number(f.floor) > 0 && Boolean(f.step_free)),
    renovate: Boolean(phase),
  };
  if (!phase) return building;
  const start = monthIndexOf(timeline, phase.start_date);
  const end = monthIndexOf(timeline, phase.end_date);
  return { ...building, fixedPhase: { start, duration: Math.max(1, end - start + 1), name: phase.name } };
}

const toApartment = (f, key) => ({
  id: f.id,
  label: stripLabel(f.label),
  building: key,
  floor: Number(f.floor) || 0,
  rooms: Number(f.rooms),
  stepFree: Boolean(f.step_free),
  temporary: Boolean(f.is_temporary),
  schoolDistrict: f.school_district ?? null,
});

const toExternal = (f) => ({
  id: f.id,
  name: String(f.label ?? ''),
  rooms: Number(f.rooms),
  stepFree: Boolean(f.step_free),
  availableFrom: 0,
  availableTo: Number.POSITIVE_INFINITY,
});

const toHousehold = (h, assignment) => ({
  id: h.id,
  name: String(h.name ?? ''),
  short: lastWord(h.name),
  apartment: h.home_flat_id,
  persons: Number(h.members) || 1,
  roomsMin: Number(h.needs_rooms),
  stepFree: Boolean(h.needs_step_free),
  note: h.note || '',
  schoolDistrict: h.school_district ?? null,
  inviteCode: h.invite_code ?? null,
  appStatus: assignment ? assignment.status ?? null : null,
  appReason: assignment ? assignment.conflict_reason ?? null : null,
});

/** Planner project from the five tables. Households without a known home flat are skipped and listed in remote.skipped. */
export function toProject(data) {
  const { project: row, phases = [], flats = [], households = [], assignments = [] } = data;
  const sortedPhases = [...phases].sort(byPhaseOrder);
  const timeline = timelineStart(sortedPhases);
  const names = unique([...sortedPhases.map((p) => p.building), ...flats.map((f) => f.building)]).filter((n) => !isExternal(n));
  const keyOf = new Map(names.map((n, i) => [n, `B${i + 1}`]));
  const buildings = names.map((name) => toBuilding(name, keyOf.get(name), flats, sortedPhases.find((p) => p.building === name), timeline));
  const apartments = flats.filter((f) => !isExternal(f.building)).map((f) => toApartment(f, keyOf.get(f.building)));
  const external = flats.filter((f) => isExternal(f.building)).map(toExternal);
  const position = new Map(apartments.map((a, i) => [a.id, i]));
  const assignmentOf = new Map(assignments.map((a) => [a.household_id, a]));
  const known = households.filter((h) => position.has(h.home_flat_id));
  const skipped = households.filter((h) => !position.has(h.home_flat_id)).map((h) => String(h.name ?? ''));
  const mapped = known
    .map((h) => toHousehold(h, assignmentOf.get(h.id)))
    .sort((a, b) => position.get(a.apartment) - position.get(b.apartment));
  return scheduleProject({
    name: row.name,
    owner: `${row.name} (Verwaltung)`,
    timeline,
    buildings,
    apartments,
    external,
    households: mapped,
    remote: { id: row.id, name: row.name, city: row.city ?? '', adminCode: row.admin_code ?? null, loadedAt: Date.now(), skipped },
  });
}

/** Load one project from the database and map it for the planner. */
export async function loadRemoteProject(projectId, options = {}) {
  return toProject(await loadProjectData(projectId, options));
}
