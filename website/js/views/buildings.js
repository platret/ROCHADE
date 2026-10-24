/* Gebäude view: all three buildings as stacked floors for one month, plus movement paths. */
import { esc, icon, month, byId, rooms, flatLabelOf, apartmentLabel } from './format.js';
import { stateAt } from '../planner.js';

const STATUS_DE = {
  home: 'zu Hause', away: 'ausgezogen', renovation: 'in Sanierung', temp: 'Rochade-Wohnung belegt', vacant: 'frei', unavailable: 'nicht verfügbar',
};

function cell(project, s, names) {
  const who = s.householdId ? names[s.householdId] : '';
  const label = apartmentLabel(project, s.id);
  const title = `${label} · ${rooms(s.rooms)} · ${STATUS_DE[s.status]}${who ? ` · ${who}` : ''}`;
  return `<button type="button" class="apt is-${s.status}" data-apt="${esc(s.id)}" ${s.householdId ? `data-household="${esc(s.householdId)}"` : ''} title="${esc(title)}" aria-label="${esc(title)}">
    <span class="apt-id">${esc(label.replace(/^[A-Z]-/, ''))}</span><span class="apt-who">${esc(who)}</span></button>`;
}

const moveItems = (project, names, list, verb) =>
  list.map((m) => `<li>${esc(names[m.householdId])} <span class="muted">${verb} ${esc(flatLabelOf(project, m.flatId))}</span></li>`).join('');

export function renderMoves(project, plan, monthIndex) {
  const state = stateAt(project, plan, monthIndex);
  const names = plan.stats.names;
  const moveList = (list, verb) => moveItems(project, names, list, verb);
  return `<div class="moves">
    <h3 class="moves-title">${esc(month(project, monthIndex))}</h3>
    ${state.moves.out.length ? `<p class="label">${icon('i-move')} Auszug in die Rochade-Wohnung</p><ul>${moveList(state.moves.out, '→')}</ul>` : ''}
    ${state.moves.back.length ? `<p class="label">${icon('i-return')} Rückkehr in die sanierte Wohnung</p><ul>${moveList(state.moves.back, '←')}</ul>` : ''}
    ${!state.moves.out.length && !state.moves.back.length ? '<p class="muted">Keine Umzüge in diesem Monat.</p>' : ''}
  </div>`;
}

export function renderBuildings(project, plan, monthIndex) {
  const state = stateAt(project, plan, monthIndex);
  const names = plan.stats.names;
  const floors = [...new Set(project.apartments.map((a) => a.floor))].sort((a, b) => b - a);

  const houses = project.buildings.map((b) => {
    const phase = plan.phases.find((p) => p.building === b.id);
    const renovating = state.apartments.some((s) => s.building === b.id && s.status === 'renovation');
    const rows = floors.map((f) => {
      const cells = state.apartments.filter((s) => s.building === b.id && s.floor === f).map((s) => cell(project, s, names)).join('');
      return `<div class="floor"><span class="floor-no">${f === 0 ? 'EG' : `${f}. OG`}</span>${cells}</div>`;
    }).join('');
    return `<section class="house${renovating ? ' is-renovating' : ''}" data-building="${b.id}" aria-label="${esc(b.name)}">
      <header><b>${esc(b.name)}</b><small>${esc(b.street)} · ${b.lift ? 'mit Lift' : 'ohne Lift'}</small>
        <small class="house-phase">${phase ? `${esc(phase.name)} · ${esc(month(project, phase.start, 'short'))} bis ${esc(month(project, phase.start + phase.duration, 'short'))}` : ''}</small></header>
      ${rows}
    </section>`;
  }).join('');

  const ext = state.external.map((e) => cell(project, { ...e, rooms: e.rooms }, names)).join('');
  const moveList = (list, verb) => moveItems(project, names, list, verb);

  return `<div class="houses" data-month="${monthIndex}">
    ${houses}
    <section class="house house-external" aria-label="Externe Rochade-Wohnungen"><header><b>Extern</b><small>Rochade-Wohnungen ausserhalb der Siedlung</small></header>
      <div class="floor floor-external">${ext}</div></section>
    <svg class="paths" aria-hidden="true"></svg>
  </div>
  <div class="moves">
    <h3 class="moves-title">${esc(month(project, monthIndex))}</h3>
    ${state.moves.out.length ? `<p class="label">${icon('i-move')} Auszug in die Rochade-Wohnung</p><ul>${moveList(state.moves.out, '→')}</ul>` : ''}
    ${state.moves.back.length ? `<p class="label">${icon('i-return')} Rückkehr in die sanierte Wohnung</p><ul>${moveList(state.moves.back, '←')}</ul>` : ''}
    ${!state.moves.out.length && !state.moves.back.length ? '<p class="muted">Keine Umzüge in diesem Monat.</p>' : ''}
  </div>`;
}

/** Draw movement paths for the current month after the DOM is in place. */
export function drawPaths(container, project, plan, monthIndex) {
  const svg = container.querySelector('.paths');
  if (!svg) return;
  const state = stateAt(project, plan, monthIndex);
  const households = byId(project.households);
  const box = container.getBoundingClientRect();
  const center = (id) => {
    const el = container.querySelector(`[data-apt="${CSS.escape(id)}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
  };
  const path = (from, to, cls) => {
    const a = center(from); const b = center(to);
    if (!a || !b) return '';
    const dx = (b.x - a.x) / 2;
    return `<path class="${cls}" d="M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}"/>`;
  };
  const out = state.moves.out.map((m) => path(households.get(m.householdId).apartment, m.flatId, 'path-out'));
  const back = state.moves.back.map((m) => path(m.flatId, households.get(m.householdId).apartment, 'path-back'));
  svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
  svg.setAttribute('width', box.width);
  svg.setAttribute('height', box.height);
  svg.innerHTML = [...out, ...back].join('');
}

export const BUILDINGS_LEGEND = `<ul class="legend" aria-label="Legende">
  <li><i class="sw sw-home"></i>Bewohnt</li>
  <li><i class="sw sw-renovation"></i>In Sanierung</li>
  <li><i class="sw sw-temp"></i>Haushalt in einer Rochade-Wohnung</li>
  <li><i class="sw sw-vacant"></i>Frei</li>
</ul>`;
