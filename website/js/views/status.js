/* Status panel: feasibility, conflicts with reasons, suggestions, and who is affected by the last change. */
import { esc, icon, month, plural } from './format.js';
import { suggestStart } from '../planner.js';

function conflictItem(project, plan, c) {
  const h = project.households.find((x) => x.id === c.householdId);
  const phase = plan.phases.find((p) => p.id === c.phaseId);
  return `<li><b>${esc(h.name)}</b> <span class="muted">(${esc(phase.name)}, ab ${esc(month(project, c.from))})</span><br>${esc(c.reason)}</li>`;
}

export function renderStatus(project, plan, applied, diff, lastChanged) {
  const n = plan.conflicts.length;
  const changedList = diff && diff.affected.length
    ? `<details class="affected" ${diff.affected.length <= 12 ? 'open' : ''}><summary>${plural(diff.affected.length, 'Haushalt betroffen', 'Haushalte betroffen')} durch die letzte Änderung</summary>
        <ul>${diff.affected.map((x) => `<li><b>${esc(plan.stats.names[x.householdId])}</b> <span class="muted">${esc(x.detail || x.change)}</span></li>`).join('')}</ul></details>`
    : '';

  if (n === 0) {
    return `<div class="status-panel is-ok">
      <p class="status-title">${icon('i-check-circle')} Plan machbar</p>
      <p>Alle ${plan.stats.households} Haushalte haben eine passende Rochade-Wohnung und kommen in die sanierte Wohnung zurück. ${plan.stats.moves} Umzüge, ${plan.stats.flats} Rochade-Wohnungen im Einsatz.</p>
      ${plan.warnings.length ? `<p class="body-sm">${plan.warnings.map((w) => `${w.phases.join(' und ')} überlappen sich um ${plural(w.months, 'Monat', 'Monate')}.`).join(' ')}</p>` : ''}
      ${changedList}
    </div>`;
  }

  const byPhase = project.phases
    .map((p) => ({ phase: p, count: plan.conflicts.filter((c) => c.phaseId === p.id).length }))
    .filter((x) => x.count > 0);
  const suggestions = byPhase.map(({ phase }) => {
    const s = suggestStart(project, applied, phase.id);
    if (s === null) return `<li>${esc(phase.name)}: kein konfliktfreier Starttermin im Zeitraum. Es braucht eine zusätzliche Rochade-Wohnung.</li>`;
    const highlight = phase.id !== lastChanged;
    return `<li>${esc(phase.name)} ab <b>${esc(month(project, s))}</b> ${highlight ? 'löst alle Konflikte.' : 'wäre konfliktfrei.'}
      <button type="button" class="btn btn-sm ${highlight ? 'btn-primary' : ''}" data-apply-phase="${phase.id}" data-apply-start="${s}">${icon('i-swap')} Übernehmen</button></li>`;
  }).join('');

  return `<div class="status-panel is-conflict">
    <p class="status-title">${icon('i-alert')} ${plural(n, 'Konflikt', 'Konflikte')} in ${byPhase.map((x) => esc(x.phase.name)).join(' und ')}</p>
    <ul class="conflicts">${plan.conflicts.slice(0, 4).map((c) => conflictItem(project, plan, c)).join('')}${n > 4 ? `<li class="muted">… und ${n - 4} weitere</li>` : ''}</ul>
    <p class="label">Vorschlag</p>
    <ul class="suggestions">${suggestions}</ul>
    ${changedList}
  </div>`;
}
