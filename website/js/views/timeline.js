/* Zeitplan view: one row per household, grouped by building, with phase bands and relocation bars. */
import { esc, icon, month, percent, byId, flatLabelOf, apartmentLabel } from './format.js';

const MOVE_W = 0.35; // months, visual width of the move marker

export function barsFor(project, a, months) {
  const left = percent(a.from, months);
  const home = a.from > 0 ? `<i class="bar bar-home" style="left:0;width:${left}" title="Zu Hause"><span>zu Hause</span></i>` : '';
  if (!a.flatId) {
    return home + `<i class="bar bar-conflict" style="left:${left};width:${percent(a.to - a.from, months)}" title="Keine passende Rochade-Wohnung">${icon('i-alert')}<span>Konflikt</span></i>`;
  }
  const flat = esc(flatLabelOf(project, a.flatId).replace('Whg. ', ''));
  const tempFrom = a.from + MOVE_W;
  const back = a.to < months
    ? `<i class="bar bar-back" style="left:${percent(a.to, months)};width:${percent(months - a.to, months)}" title="Rückkehr ${month(project, a.to)}">${icon('i-return')}<span>zurück zu Hause</span></i>`
    : '';
  return home +
    `<i class="bar bar-move" style="left:${left};width:${percent(MOVE_W, months)}" title="Umzug ${month(project, a.from)}"></i>` +
    `<i class="bar bar-temp" style="left:${percent(tempFrom, months)};width:${percent(a.to - tempFrom, months)}" title="Rochade-Wohnung ${flat}, ${month(project, a.from)} bis ${month(project, a.to)}"><span>Rochade-Wohnung ${flat}</span></i>` +
    back;
}

function phaseBand(project, phase, months) {
  const building = project.buildings.find((b) => b.id === phase.building);
  return `<div class="tl-band" style="left:${percent(phase.start, months)};width:${percent(phase.duration, months)}">
    <span>${esc(phase.name)} · ${esc(building.name)}</span></div>`;
}

export function renderTimeline(project, plan, { changed = new Set() } = {}) {
  const months = project.timeline.months;
  const households = byId(project.households);
  const apartments = byId(project.apartments);
  const axis = Array.from({ length: months }, (_, i) =>
    `<span class="tl-month${i % 3 === 0 ? ' is-major' : ''}">${esc(month(project, i, 'short'))}</span>`).join('');

  const groups = project.buildings.map((b) => {
    const phase = plan.phases.find((p) => p.building === b.id);
    const rows = plan.assignments
      .filter((a) => apartments.get(households.get(a.householdId).apartment).building === b.id)
      .map((a) => {
        const h = households.get(a.householdId);
        const cls = ['tl-row', changed.has(h.id) ? 'is-changed' : '', a.flatId ? '' : 'has-conflict'].join(' ');
        return `<div class="${cls}" data-household="${h.id}">
          <div class="tl-name"><b>${esc(h.name)}</b><small>Whg. ${esc(apartmentLabel(project, h.apartment))} · ${h.persons} P.</small></div>
          <div class="tl-track">${barsFor(project, a, months)}</div>
        </div>`;
      }).join('');
    return `<section class="tl-group" aria-label="${esc(b.name)}">
      <header class="tl-group-head"><div class="tl-name"><b>${esc(b.name)}</b><small>${esc(b.street)}</small></div>
        <div class="tl-track tl-track-band">${phase ? phaseBand(project, phase, months) : ''}</div></header>
      ${rows}
    </section>`;
  }).join('');

  return `<div class="tl" style="--months:${months}">
    <div class="tl-axis"><div class="tl-name"></div><div class="tl-track tl-track-axis">${axis}</div></div>
    ${groups}
  </div>`;
}

export const TIMELINE_LEGEND = `<ul class="legend" aria-label="Legende">
  <li><i class="sw sw-home"></i>In der eigenen Wohnung</li>
  <li><i class="sw sw-move"></i>Umzug</li>
  <li><i class="sw sw-temp"></i>In der Rochade-Wohnung</li>
  <li><i class="sw sw-back"></i>Zurück, saniert</li>
  <li><i class="sw sw-conflict"></i>Konflikt</li>
</ul>`;
