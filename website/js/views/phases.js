/* Bauetappen control: three phases on the project axis, nudged month by month. Draft vs. applied. */
import { esc, icon, month, percent } from './format.js';

export function renderPhases(project, applied, draft, plan) {
  const months = project.timeline.months;
  const dirty = project.phases.some((p) => applied[p.id] !== draft[p.id]);
  const axis = Array.from({ length: months }, (_, i) =>
    `<span class="ph-month${i % 3 === 0 ? ' is-major' : ''}">${i % 3 === 0 ? esc(month(project, i, 'short')) : ''}</span>`).join('');

  const rows = project.phases.map((p) => {
    const building = project.buildings.find((b) => b.id === p.building);
    const start = draft[p.id];
    const was = applied[p.id];
    const max = months - p.duration;
    const conflicts = plan.conflicts.filter((c) => c.phaseId === p.id).length;
    const shifted = start !== was;
    return `<div class="ph-row${shifted ? ' is-shifted' : ''}" data-phase="${p.id}">
      <div class="ph-name"><b>${esc(p.name)}</b><small>${esc(building.name)} · ${p.duration} Monate${conflicts ? ` · <span class="danger">${conflicts} Konflikt${conflicts > 1 ? 'e' : ''}</span>` : ''}</small></div>
      <div class="ph-track">
        ${shifted ? `<i class="ph-bar ph-bar-was" style="left:${percent(was, months)};width:${percent(p.duration, months)}"></i>` : ''}
        <i class="ph-bar" style="left:${percent(start, months)};width:${percent(p.duration, months)}"><span>${esc(month(project, start, 'short'))} – ${esc(month(project, start + p.duration, 'short'))}</span></i>
      </div>
      <div class="ph-nudge" role="group" aria-label="Start von ${esc(p.name)} verschieben">
        <button type="button" class="nudge" data-phase="${p.id}" data-delta="-1" ${start <= 0 ? 'disabled' : ''} aria-label="Einen Monat früher">${icon('i-minus')}</button>
        <output class="ph-start data" aria-live="off">${esc(month(project, start, 'short'))}</output>
        <button type="button" class="nudge" data-phase="${p.id}" data-delta="1" ${start >= max ? 'disabled' : ''} aria-label="Einen Monat später">${icon('i-plus')}</button>
      </div>
    </div>`;
  }).join('');

  return `<div class="ph" style="--months:${months}">
    <div class="ph-axis"><div class="ph-name"></div><div class="ph-track ph-track-axis">${axis}</div><div class="ph-nudge"></div></div>
    ${rows}
  </div>
  <div class="ph-actions">
    <button type="button" class="btn btn-primary" data-action="recalc" ${dirty ? '' : 'disabled'}>${icon('i-swap')} Plan neu berechnen</button>
    <button type="button" class="btn btn-ghost" data-action="discard" ${dirty ? '' : 'hidden'}>Änderung verwerfen</button>
    <button type="button" class="btn btn-ghost" data-action="reset" ${project.phases.every((p) => applied[p.id] === p.start && draft[p.id] === p.start) ? 'hidden' : ''}>Ausgangslage</button>
    ${dirty ? '<p class="ph-hint body-sm muted">Der angezeigte Plan gilt noch für die alten Termine.</p>' : ''}
  </div>`;
}
