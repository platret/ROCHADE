/* Automatic Etappen: ROCHADE derives the renovation schedule from the buildings themselves.
   One Etappe per renovated building, in the order the buildings were entered; the duration follows
   the number of apartments; one buffer month between Etappen; reserve months at the end so single
   Etappen can still be shifted. A building loaded from the database brings its dates along as
   `fixedPhase` {start, duration, name}; those are kept and the remaining Etappen chain after them.
   Pure functions, inputs are never mutated. */

export const BASE_MONTHS = 3;          // Grundaufwand je Haus: Installation, Rohbau, Abnahme
export const APARTMENTS_PER_MONTH = 6; // ein zusätzlicher Monat je angefangene sechs Wohnungen
export const BUFFER_MONTHS = 1;        // zwischen zwei Etappen: Rückzug und Abnahme
export const RESERVE_MONTHS = 3;       // am Ende des Zeitraums, damit Etappen verschoben werden können
export const MIN_MONTHS = 12;

export const phaseDuration = (apartments) => BASE_MONTHS + Math.ceil(Math.max(1, apartments) / APARTMENTS_PER_MONTH);
export const isRenovated = (building) => building.renovate !== false;
const phaseEnd = (p) => p.start + p.duration;

/** New project with phases and timeline length derived from the buildings. */
export function scheduleProject(project) {
  const renovated = project.buildings.filter(isRenovated);
  const fixedEnds = renovated.filter((b) => b.fixedPhase).map((b) => phaseEnd(b.fixedPhase));
  // null until something is planned: the first automatic Etappe starts at month 0, later ones after the buffer
  let cursor = fixedEnds.length ? Math.max(...fixedEnds) : null;
  const phases = renovated.map((b, i) => {
    const apartments = project.apartments.filter((a) => a.building === b.id).length;
    const base = { id: `P${i + 1}`, name: `Etappe ${i + 1}`, building: b.id, apartments };
    if (b.fixedPhase) {
      const { start, duration, name } = b.fixedPhase;
      return { ...base, name: name || base.name, start, duration, fixed: true };
    }
    const duration = phaseDuration(apartments);
    const start = cursor === null ? 0 : cursor + BUFFER_MONTHS;
    cursor = start + duration;
    return { ...base, start, duration };
  });
  const end = Math.max(0, ...phases.map(phaseEnd));
  const months = Math.max(MIN_MONTHS, end + RESERVE_MONTHS);
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
  const total = Math.max(...project.phases.map(phaseEnd));
  const fixed = project.phases.filter((p) => p.fixed).length;
  const etappen = `${n} Etappe${n === 1 ? '' : 'n'}`;
  if (fixed === n) return `${etappen} mit den Terminen aus der Datenbank übernommen, ${total} Monate Bauzeit.`;
  if (fixed) return `${fixed} von ${n} Etappen mit festen Terminen aus der Datenbank, die übrigen automatisch danach geplant (${BUFFER_MONTHS} Monat Puffer), ${total} Monate Bauzeit.`;
  return `${etappen} automatisch geplant, Reihenfolge wie erfasst: je Haus ${BASE_MONTHS} Monate plus 1 Monat je ${APARTMENTS_PER_MONTH} Wohnungen, ${BUFFER_MONTHS} Monat Puffer dazwischen, ${total} Monate Bauzeit.`;
}
