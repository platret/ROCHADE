/* Status panel: feasibility, conflicts with reasons, suggestions, and who is affected by the last change. */
import { esc, icon, month, plural } from './format.js';
import { suggestStart } from '../planner.js';
import { needsFor, findListings, searchPrompt, searchLinks } from '../listings.js';
import { rooms } from './format.js';

function conflictItem(project, plan, c) {
  const h = project.households.find((x) => x.id === c.householdId);
  const phase = plan.phases.find((p) => p.id === c.phaseId);
  return `<li><b>${esc(h.name)}</b> <span class="muted">(${esc(phase.name)}, ab ${esc(month(project, c.from))})</span><br>${esc(c.reason)}</li>`;
}

export function renderStatus(project, plan, applied, diff, lastChanged, { searchOpen = false } = {}) {
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

  const needs = needsFor(project, plan);
  const needList = needs.map((x) => `<li><b>${x.households.length} × ${rooms(x.roomsMin)}${x.stepFree ? ', hindernisfrei' : ''}</b> <span class="muted">${esc(month(project, x.from))} bis ${esc(month(project, x.to - 1))} · ${x.households.map((h) => esc(h.name)).join(', ')}</span></li>`).join('');
  const links = searchLinks(needs).map((l) => `<a href="${l.url}" target="_blank" rel="noopener">${esc(l.name)} ↗</a>`).join('');
  const prompt = searchPrompt(project, needs);
  let results = '';
  if (searchOpen) {
    const found = findListings(project, plan);
    results = found.length
      ? `<ul class="listings" aria-label="Gefundene Wohnungen">${found.map((l) => `<li class="listing">
          <div class="listing-head"><div><b>${esc(l.name)}</b><small>${esc(l.quarter)} · ${esc(l.distance)} · ${esc(l.source)} · ${esc(l.kind)}</small></div><span class="data">CHF ${l.rent.toLocaleString('de-CH')}</span></div>
          <div class="listing-meta">${rooms(l.rooms)}${l.stepFree ? ' · hindernisfrei' : ''} · frei ${esc(month(project, l.availableFrom, 'short'))} bis ${esc(month(project, Math.min(l.availableTo, project.timeline.months) - 1, 'short'))}</div>
          <div class="listing-fit">${icon('i-check')} Passt für ${l.solves.flatMap((x) => x.households.map((h) => esc(h.name))).slice(0, 3).join(', ')}${l.solves.reduce((t, x) => t + x.households.length, 0) > 3 ? ' und weitere' : ''}</div>
          <button type="button" class="btn btn-primary btn-sm" data-adopt="${l.id}">Als Rochade-Wohnung übernehmen</button>
        </li>`).join('')}</ul>
        <p class="body-sm muted">Beispieltreffer, fiktiv. Im Produkt kommen hier echte Inserate von Flatfox, Homegate, ImmoScout24, Partner-Genossenschaften und der Stadt, gefiltert nach genau diesem Bedarf.</p>`
      : '<p class="body-sm muted">Keine passenden Beispieltreffer mehr. Nutzen Sie die Suchlinks oder den KI-Suchauftrag.</p>';
  }
  return `<div class="status-panel is-conflict">
    <p class="status-title">${icon('i-alert')} ${plural(n, 'Konflikt', 'Konflikte')} in ${byPhase.map((x) => esc(x.phase.name)).join(' und ')}</p>
    <ul class="conflicts">${plan.conflicts.slice(0, 4).map((c) => conflictItem(project, plan, c)).join('')}${n > 4 ? `<li class="muted">… und ${n - 4} weitere</li>` : ''}</ul>
    <p class="label">Lösung 1 · Etappe verschieben</p>
    <ul class="suggestions">${suggestions}</ul>
    <div class="search">
      <p class="label">Lösung 2 · Wohnungen ausserhalb der Genossenschaft</p>
      <ul class="needs">${needList}</ul>
      <div class="search-actions">
        <button type="button" class="btn btn-primary btn-sm" data-action="search" ${searchOpen ? 'hidden' : ''}>Passende Wohnungen suchen</button>
        <button type="button" class="btn btn-sm" data-action="copy-prompt">KI-Suchauftrag kopieren</button>
        <span class="search-links">${links}</span>
      </div>
      ${results}
      <details class="prompt"><summary>Suchauftrag anzeigen</summary><pre>${esc(prompt)}</pre></details>
    </div>
    ${changedList}
  </div>`;
}
