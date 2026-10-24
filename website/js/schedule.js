/* Automatic Etappen: ROCHADE derives the renovation schedule from the buildings themselves.
   One Etappe per renovated building, in the order the buildings were entered; the duration follows
   the number of apartments; one buffer month between Etappen; reserve months at the end so single
   Etappen can still be shifted. Pure functions, inputs are never mutated. */

export const BASE_MONTHS = 3;          // Grundaufwand je Haus: Installation, Rohbau, Abnahme
export const APARTMENTS_PER_MONTH = 6; // ein zusätzlicher Monat je angefangene sechs Wohnungen
export const BUFFER_MONTHS = 1;        // zwischen zwei Etappen: Rückzug und Abnahme
export const RESERVE_MONTHS = 3;       // am Ende des Zeitraums, damit Etappen verschoben werden können
export const MIN_MONTHS = 12;

export const phaseDuration = (apartments) => BASE_MONTHS + Math.ceil(Math.max(1, apartments) / APARTMENTS_PER_MONTH);
export const isRenovated = (building) => building.renovate !== false;

/** New project with phases and timeline length derived from the buildings. */
export function scheduleProject(project) {
  let cursor = 0;
  const phases = project.buildings.filter(isRenovated).map((b, i) => {
    const apartments = project.apartments.filter((a) => a.building === b.id).length;
    const duration = phaseDuration(apartments);
    const start = i === 0 ? 0 : cursor + BUFFER_MONTHS;
    cursor = start + duration;
    return { id: `P${i + 1}`, name: `Etappe ${i + 1}`, building: b.id, start, duration, apartments };
  });
  const months = Math.max(MIN_MONTHS, cursor + RESERVE_MONTHS);
  return { ...project, phases, timeline: { ...project.timeline, months } };
}

/** Manual shifts are kept relative to the automatic start across a re-plan; new phases start automatically. */
export function rebaseStarts(prev, applied, next) {
  const max = next.timeline.months;
  return Object.fromEntries(next.phases.map((p) => {
    const old = prev.phases.find((o) => o.building === p.building);
    const shift = old ? (applied[old.id] ?? old.start) - old.start : 0;
    return [p.id, Math.min(Math.max(0, p.start + shift), max - p.duration)];
  }));
}

/** One sentence for the UI that says how the schedule was derived. */
export function scheduleSummary(project) {
  const n = project.phases.length;
  if (!n) return 'Keine Liegenschaft ist zur Sanierung markiert.';
  const last = project.phases[n - 1];
  const total = last.start + last.duration;
  return `${n} Etappe${n === 1 ? '' : 'n'} automatisch geplant, Reihenfolge wie erfasst: je Haus ${BASE_MONTHS} Monate plus 1 Monat je ${APARTMENTS_PER_MONTH} Wohnungen, ${BUFFER_MONTHS} Monat Puffer dazwischen, ${total} Monate Bauzeit.`;
}
