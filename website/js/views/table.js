/* Haushalte view: a plain, ruled table. No cards. */
import { esc, icon, month, byId, householdNeed, flatLabelOf } from './format.js';

export function renderTable(project, plan, { building = 'all', changed = new Set() } = {}) {
  const apartments = byId(project.apartments);
  const households = project.households.filter((h) => building === 'all' || apartments.get(h.apartment).building === building);
  const assignments = byId(plan.assignments.map((a) => ({ ...a, id: a.householdId })));

  const rows = households.map((h) => {
    const a = assignments.get(h.id);
    const phase = plan.phases.find((p) => p.id === a.phaseId);
    const status = a.flatId
      ? `<span class="status is-ok">${icon('i-check')}Zugeteilt</span>`
      : `<span class="status is-conflict">${icon('i-alert')}Konflikt</span>`;
    return `<tr data-household="${h.id}" class="${changed.has(h.id) ? 'is-changed' : ''}${a.flatId ? '' : ' has-conflict'}">
      <th scope="row"><b>${esc(h.name)}</b>${h.note ? `<small>${esc(h.note)}</small>` : ''}</th>
      <td class="data">${esc(h.apartment)}</td>
      <td>${esc(householdNeed(h))}</td>
      <td>${esc(phase.name)}</td>
      <td class="data">${a.flatId ? esc(flatLabelOf(project, a.flatId)) : '<span class="muted">—</span>'}</td>
      <td class="data">${esc(month(project, a.from, 'short'))}</td>
      <td class="data">${a.to < project.timeline.months ? esc(month(project, a.to, 'short')) : '<span class="muted">offen</span>'}</td>
      <td>${status}</td>
    </tr>`;
  }).join('');

  const filters = [{ id: 'all', name: 'Alle' }, ...project.buildings].map((b) =>
    `<button type="button" class="chip${building === b.id ? ' is-active' : ''}" data-filter-building="${b.id}" aria-pressed="${building === b.id}">${esc(b.name)}</button>`).join('');

  return `<div class="table-tools"><div class="chips" role="group" aria-label="Nach Gebäude filtern">${filters}</div>
    <p class="muted body-sm">${households.length} Haushalte</p></div>
  <div class="table-scroll"><table class="hh">
    <thead><tr><th scope="col">Haushalt</th><th scope="col">Wohnung</th><th scope="col">Bedarf</th><th scope="col">Etappe</th><th scope="col">Rochade-Wohnung</th><th scope="col">Auszug</th><th scope="col">Rückkehr</th><th scope="col">Status</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}
