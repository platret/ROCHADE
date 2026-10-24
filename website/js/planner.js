/* ROCHADE planning engine. Pure functions, no DOM, no mutation of inputs.
   This is a deterministic heuristic with explicit hard constraints, not an optimiser:
   phases are handled in start order, the households with the hardest requirements first,
   and each household takes the smallest fitting flat that is free for its whole absence. */

const MONTHS_DE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

export function monthLabel(project, index, style = 'long') {
  const { startYear, startMonth } = project.timeline;
  const abs = startMonth - 1 + index;
  const year = startYear + Math.floor(abs / 12);
  const month = ((abs % 12) + 12) % 12;
  return style === 'short' ? `${MONTHS_SHORT[month]} ${String(year).slice(2)}` : `${MONTHS_DE[month]} ${year}`;
}

export function validateProject(project) {
  const errors = [];
  const apartmentIds = new Set(project.apartments.map((a) => a.id));
  const seen = new Set();
  for (const h of project.households) {
    if (!apartmentIds.has(h.apartment)) errors.push(`${h.id}: Wohnung ${h.apartment} existiert nicht`);
    if (seen.has(h.apartment)) errors.push(`${h.apartment}: doppelt belegt`);
    seen.add(h.apartment);
    if (!(h.roomsMin > 0)) errors.push(`${h.id}: roomsMin fehlt`);
  }
  const buildingIds = new Set(project.buildings.map((b) => b.id));
  for (const p of project.phases) {
    if (!buildingIds.has(p.building)) errors.push(`${p.id}: Gebäude ${p.building} existiert nicht`);
    if (p.start < 0 || p.start + p.duration > project.timeline.months) errors.push(`${p.id}: ausserhalb des Zeitraums`);
  }
  return errors;
}

export const phaseWindow = (phase) => ({ start: phase.start, end: phase.start + phase.duration });

const overlaps = (aFrom, aTo, bFrom, bTo) => aFrom < bTo && bFrom < aTo;

export function resolvePhases(project, starts = {}) {
  const max = project.timeline.months;
  return project.phases.map((p) => {
    const requested = starts[p.id] ?? p.start;
    const start = Math.min(Math.max(0, requested), max - p.duration);
    return { ...p, start };
  });
}

const renovatingAt = (phases, buildingId, month) =>
  phases.some((p) => p.building === buildingId && month >= p.start && month < p.start + p.duration);

/** Flats that can host a household temporarily: vacant apartments inside the Siedlung plus external flats. */
export function temporaryFlats(project) {
  const occupied = new Set(project.households.map((h) => h.apartment));
  const vacant = project.apartments
    .filter((a) => !occupied.has(a.id))
    .map((a) => ({
      id: a.id, kind: 'vacant', building: a.building, floor: a.floor, rooms: a.rooms, stepFree: a.stepFree,
      label: `Whg. ${a.id}`,
      availableAt: (month, phases) => !renovatingAt(phases, a.building, month),
    }));
  const ext = project.external.map((e) => ({
    id: e.id, kind: 'external', building: null, floor: null, rooms: e.rooms, stepFree: e.stepFree,
    label: e.name,
    availableAt: (month) => month >= e.availableFrom && month < e.availableTo,
  }));
  return [...vacant, ...ext];
}

const fitsRooms = (flat, h) => flat.rooms >= h.roomsMin;
const fitsStepFree = (flat, h) => !h.stepFree || flat.stepFree;
const availableFor = (flat, from, to, phases) => {
  for (let m = from; m < to; m++) if (!flat.availableAt(m, phases)) return false;
  return true;
};
const freeFor = (flat, from, to, bookings) =>
  (bookings.get(flat.id) || []).every((b) => !overlaps(from, to, b.from, b.to));

/* Hardest first: step-free needs, then larger minimum size, then more persons, then stable id. */
const hardnessOrder = (a, b) =>
  Number(b.stepFree) - Number(a.stepFree) || b.roomsMin - a.roomsMin || b.persons - a.persons || a.id.localeCompare(b.id);

/* Cheapest fit first: keep step-free flats for those who need them, then minimal waste, then internal before external. */
const candidateOrder = (h) => (a, b) =>
  Number(a.stepFree && !h.stepFree) - Number(b.stepFree && !h.stepFree) ||
  (a.rooms - h.roomsMin) - (b.rooms - h.roomsMin) ||
  Number(a.kind === 'external') - Number(b.kind === 'external') ||
  a.id.localeCompare(b.id);

function explainConflict(h, flats, from, to, phases, bookings) {
  const fitRooms = flats.filter((f) => fitsRooms(f, h));
  const fitStepFree = fitRooms.filter((f) => fitsStepFree(f, h));
  const available = fitStepFree.filter((f) => availableFor(f, from, to, phases));
  const free = available.filter((f) => freeFor(f, from, to, bookings));
  const need = `${h.roomsMin}-Zimmer-Wohnung${h.stepFree ? ', hindernisfrei' : ''}`;
  let reason;
  if (fitStepFree.length === 0) reason = `Keine ${need} im Bestand.`;
  else if (available.length === 0) reason = `${fitStepFree.length} passende Wohnungen, aber keine ist im Zeitfenster verfügbar (Gebäude in Sanierung oder befristet vermietet).`;
  else reason = `${available.length} passende Wohnungen im Zeitfenster, alle bereits belegt.`;
  return { reason, counts: { fitRooms: fitRooms.length, fitStepFree: fitStepFree.length, available: available.length, free: free.length } };
}

/** Compute the relocation plan. Returns a new object; inputs are untouched. */
export function planRochade(project, starts = {}) {
  const phases = resolvePhases(project, starts);
  const flats = temporaryFlats(project);
  const apartmentsById = new Map(project.apartments.map((a) => [a.id, a]));
  const bookings = new Map();
  const assignments = [];
  const conflicts = [];

  const ordered = [...phases].sort((a, b) => a.start - b.start || a.id.localeCompare(b.id));
  for (const phase of ordered) {
    const { start: from, end: to } = phaseWindow(phase);
    const movers = project.households
      .filter((h) => apartmentsById.get(h.apartment).building === phase.building)
      .sort(hardnessOrder);
    for (const h of movers) {
      const candidates = flats
        .filter((f) => fitsRooms(f, h) && fitsStepFree(f, h) && availableFor(f, from, to, phases) && freeFor(f, from, to, bookings))
        .sort(candidateOrder(h));
      const flat = candidates[0] || null;
      if (flat) bookings.set(flat.id, [...(bookings.get(flat.id) || []), { householdId: h.id, from, to }]);
      else conflicts.push({ householdId: h.id, phaseId: phase.id, from, to, ...explainConflict(h, flats, from, to, phases, bookings) });
      assignments.push({ householdId: h.id, phaseId: phase.id, from, to, flatId: flat ? flat.id : null, flatLabel: flat ? flat.label : null });
    }
  }

  const warnings = [];
  for (let i = 0; i < ordered.length; i++) {
    for (let j = i + 1; j < ordered.length; j++) {
      const a = phaseWindow(ordered[i]);
      const b = phaseWindow(ordered[j]);
      if (overlaps(a.start, a.end, b.start, b.end)) {
        warnings.push({ type: 'overlap', phases: [ordered[i].id, ordered[j].id], months: Math.min(a.end, b.end) - Math.max(a.start, b.start) });
      }
    }
  }

  const byHousehold = new Map(project.households.map((h) => [h.id, h]));
  const sortedAssignments = [...assignments].sort((a, b) => a.householdId.localeCompare(b.householdId));
  return {
    phases,
    assignments: sortedAssignments,
    conflicts,
    warnings,
    bookings: Object.fromEntries([...bookings.entries()]),
    stats: {
      households: project.households.length,
      flats: flats.length,
      moves: sortedAssignments.filter((a) => a.flatId).length * 2,
      conflicts: conflicts.length,
      stepFreeNeeds: project.households.filter((h) => h.stepFree).length,
      names: Object.fromEntries([...byHousehold.values()].map((h) => [h.id, h.name])),
    },
  };
}

/** Which households see a different outcome between two plans. */
export function diffPlans(before, after) {
  const prev = new Map(before.assignments.map((a) => [a.householdId, a]));
  const affected = after.assignments.flatMap((a) => {
    const p = prev.get(a.householdId);
    if (!p) return [{ householdId: a.householdId, change: 'neu' }];
    if (p.flatId && !a.flatId) return [{ householdId: a.householdId, change: 'konflikt', detail: `vorher ${p.flatLabel}` }];
    if (!p.flatId && a.flatId) return [{ householdId: a.householdId, change: 'gelöst', detail: `neu ${a.flatLabel}` }];
    if (p.flatId !== a.flatId) return [{ householdId: a.householdId, change: 'wohnung', detail: `${p.flatLabel} → ${a.flatLabel}` }];
    if (p.from !== a.from || p.to !== a.to) return [{ householdId: a.householdId, change: 'datum', detail: `${p.from}–${p.to} → ${a.from}–${a.to}` }];
    return [];
  });
  return {
    affected,
    conflictsBefore: before.conflicts.length,
    conflictsAfter: after.conflicts.length,
  };
}

/** Earliest conflict-free start for one phase, searching outward from its current start. Null if none exists. */
export function suggestStart(project, starts, phaseId) {
  const phase = project.phases.find((p) => p.id === phaseId);
  const current = resolvePhases(project, starts).find((p) => p.id === phaseId).start;
  const max = project.timeline.months - phase.duration;
  const candidates = [];
  for (let d = 1; d <= max; d++) {
    if (current + d <= max) candidates.push(current + d);
    if (current - d >= 0) candidates.push(current - d);
  }
  const found = candidates.find((s) => planRochade(project, { ...starts, [phaseId]: s }).conflicts.length === 0);
  return found === undefined ? null : found;
}

/** Snapshot of every apartment and flat in a given month, plus the moves happening that month. */
export function stateAt(project, plan, month) {
  const assignmentByHousehold = new Map(plan.assignments.map((a) => [a.householdId, a]));
  const residentByApartment = new Map(project.households.map((h) => [h.apartment, h]));
  const tempByFlat = new Map();
  for (const a of plan.assignments) {
    if (a.flatId && month >= a.from && month < a.to) tempByFlat.set(a.flatId, a.householdId);
  }
  const apartments = project.apartments.map((apt) => {
    const resident = residentByApartment.get(apt.id);
    const renovating = renovatingAt(plan.phases, apt.building, month);
    if (renovating) return { id: apt.id, building: apt.building, floor: apt.floor, rooms: apt.rooms, status: 'renovation', householdId: resident ? resident.id : null };
    if (resident) {
      const a = assignmentByHousehold.get(resident.id);
      const away = a && month >= a.from && month < a.to;
      return { id: apt.id, building: apt.building, floor: apt.floor, rooms: apt.rooms, status: away ? 'away' : 'home', householdId: resident.id };
    }
    const temp = tempByFlat.get(apt.id);
    return { id: apt.id, building: apt.building, floor: apt.floor, rooms: apt.rooms, status: temp ? 'temp' : 'vacant', householdId: temp || null };
  });
  const external = project.external.map((e) => {
    const temp = tempByFlat.get(e.id);
    const available = month >= e.availableFrom && month < e.availableTo;
    return { id: e.id, name: e.name, rooms: e.rooms, status: !available ? 'unavailable' : temp ? 'temp' : 'vacant', householdId: temp || null };
  });
  const moves = {
    out: plan.assignments.filter((a) => a.flatId && a.from === month).map((a) => ({ householdId: a.householdId, flatId: a.flatId })),
    back: plan.assignments.filter((a) => a.flatId && a.to === month).map((a) => ({ householdId: a.householdId, flatId: a.flatId })),
  };
  return { month, apartments, external, moves };
}
