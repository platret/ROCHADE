/* Editing the project in the prototype: pure functions that return a new project, never mutate. */

const BUILDING_IDS = 'DEFGHJKLMNPQRSTUVWXYZ';
const SIZES = [2.5, 3.5, 4.5];

export function nextBuildingId(project) {
  const used = new Set(project.buildings.map((b) => b.id));
  for (const c of BUILDING_IDS) if (!used.has(c)) return c;
  return `X${project.buildings.length}`;
}

export function addBuilding(project, { name = '', street = '', floors = 3, perFloor = 3, rooms = 'mixed', lift = false, renovate = true } = {}) {
  const id = nextBuildingId(project);
  const f = Math.min(Math.max(1, Number(floors) || 1), 4);
  const per = Math.min(Math.max(1, Number(perFloor) || 1), 3);
  const sizes = rooms === 'mixed' ? SIZES : [Number(rooms)];
  const apartments = [];
  for (let floor = 0; floor < f; floor++) {
    for (let c = 1; c <= per; c++) apartments.push({ id: `${id}-${floor}${c}`, building: id, floor, rooms: sizes[(c - 1) % sizes.length], stepFree: Boolean(lift) || floor === 0 });
  }
  const building = { id, name: name.trim() || `Haus ${id}`, street: street.trim(), built: null, lift: Boolean(lift), renovate: Boolean(renovate) };
  return { ...project, buildings: [...project.buildings, building], apartments: [...project.apartments, ...apartments] };
}

/** A building can go as long as nobody lives in it; its Etappe disappears with it. */
export function removeBuilding(project, id) {
  const gone = new Set(project.apartments.filter((a) => a.building === id).map((a) => a.id));
  if (project.households.some((h) => gone.has(h.apartment))) return project;
  return {
    ...project,
    buildings: project.buildings.filter((b) => b.id !== id),
    apartments: project.apartments.filter((a) => a.building !== id),
  };
}

/** Whether the building is renovated (gets an Etappe) or only serves as Ausweichfläche. */
export function setRenovate(project, id, renovate) {
  return { ...project, buildings: project.buildings.map((b) => (b.id === id ? { ...b, renovate: Boolean(renovate) } : b)) };
}

/** Order of the buildings is the order of the Etappen. */
export function moveBuilding(project, id, delta) {
  const from = project.buildings.findIndex((b) => b.id === id);
  const to = Math.min(Math.max(0, from + Number(delta)), project.buildings.length - 1);
  if (from < 0 || to === from) return project;
  const buildings = project.buildings.filter((b) => b.id !== id);
  buildings.splice(to, 0, project.buildings[from]);
  return { ...project, buildings };
}

export function setLift(project, id, lift) {
  return {
    ...project,
    buildings: project.buildings.map((b) => (b.id === id ? { ...b, lift: Boolean(lift) } : b)),
    apartments: project.apartments.map((a) => (a.building === id ? { ...a, stepFree: Boolean(lift) || a.floor === 0 } : a)),
  };
}

export function vacantApartments(project) {
  const occupied = new Set(project.households.map((h) => h.apartment));
  return project.apartments.filter((a) => !occupied.has(a.id));
}

export function addHousehold(project, { name = '', apartment, persons = 1, roomsMin = 2.5, stepFree = false, note = '' } = {}) {
  const clean = name.trim();
  if (!clean || !apartment) return project;
  if (!project.apartments.some((a) => a.id === apartment)) return project;
  if (project.households.some((h) => h.apartment === apartment)) return project;
  let n = project.households.length + 1;
  let id = `H${String(n).padStart(2, '0')}`;
  while (project.households.some((h) => h.id === id)) { n += 1; id = `H${String(n).padStart(2, '0')}`; }
  const short = clean.split(/\s+/).pop();
  const household = { id, name: clean, short, apartment, persons: Math.min(Math.max(1, Number(persons) || 1), 9), roomsMin: Number(roomsMin) || 2.5, stepFree: Boolean(stepFree), note: note.trim() };
  return { ...project, households: [...project.households, household] };
}

export function removeHousehold(project, id) {
  return { ...project, households: project.households.filter((h) => h.id !== id) };
}

export function addExternal(project, { id: wanted, name = '', rooms = 3.5, stepFree = false, availableFrom = 0, availableTo } = {}) {
  const months = project.timeline.months;
  let n = project.external.length + 1;
  let id = wanted && !project.external.some((e) => e.id === wanted) ? wanted : `E-${n}`;
  while (project.external.some((e) => e.id === id)) { n += 1; id = `E-${n}`; }
  const from = Math.min(Math.max(0, Number(availableFrom) || 0), months - 1);
  const to = availableTo == null || availableTo === '' || !Number.isFinite(Number(availableTo)) ? Number.POSITIVE_INFINITY : Math.min(Math.max(from + 1, Number(availableTo)), months);
  const flat = { id, name: name.trim() || `Externe Wohnung ${n}`, rooms: Number(rooms) || 3.5, stepFree: Boolean(stepFree), availableFrom: from, availableTo: to };
  return { ...project, external: [...project.external, flat] };
}

export function removeExternal(project, id) {
  return { ...project, external: project.external.filter((e) => e.id !== id) };
}
