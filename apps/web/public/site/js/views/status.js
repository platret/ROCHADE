/* Status panel: feasibility, conflicts with reasons, two solutions (shift an Etappe, or find flats outside
   the cooperative, live from Flatfox), and who is affected by the last change. */
import { esc, icon, month, plural, rooms } from './format.js';
import { suggestStart } from '../planner.js';
import { needsFor, findListings, searchPrompt, searchLinks } from '../listings.js';
import { SEARCH_RADIUS_KM } from '../flatfox.js';

const IDLE = { status: 'idle', items: [], loaded: 0, error: null, source: null, fetchedAt: null, open: true };

function conflictItem(project, plan, c) {
  const h = project.households.find((x) => x.id === c.householdId);
  const phase = plan.phases.find((p) => p.id === c.phaseId);
  return `<li><b>${esc(h.name)}</b> <span class="muted">(${esc(phase.name)}, ab ${esc(month(project, c.from))})</span><br>${esc(c.reason)}</li>`;
}

const distanceLabel = (km) => (km == null ? '' : km < 0.1 ? 'unter 100 m' : km < 1 ? `${Math.round(km * 10) * 100} m` : `${km.toFixed(1).replace('.', ',')} km`);
const floorLabel = (f) => (f == null ? '' : f === 0 ? 'Parterre' : `${f}. OG`);
const dateLabel = (iso) => { const [y, m, d] = String(iso).split('-'); return `${Number(d)}.${Number(m)}.${y}`; };
const timeLabel = (ts) => new Date(ts).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });

function availabilityLabel(project, l) {
  if (l.movingType) {
    if (l.movingType === 'dat' && l.movingDate) return `frei ab ${dateLabel(l.movingDate)}`;
    return l.movingType === 'imm' ? 'sofort frei' : 'frei nach Vereinbarung';
  }
  const to = Number.isFinite(l.availableTo) ? ` bis ${esc(month(project, Math.min(l.availableTo, project.timeline.months) - 1, 'short'))}` : ', unbefristet';
  return `frei ${esc(month(project, l.availableFrom, 'short'))}${to}`;
}

function listingItem(project, l) {
  const names = l.solves.flatMap((x) => x.households.map((h) => esc(h.name)));
  const meta = [rooms(l.rooms), l.surface ? `${l.surface} m²` : '', floorLabel(l.floor), l.stepFree ? 'hindernisfrei' : '', availabilityLabel(project, l)].filter(Boolean).join(' · ');
  const small = [l.quarter, distanceLabel(l.distanceKm), l.source, l.kind, l.agency, l.doubtful ? 'Angaben unvollständig, bitte prüfen' : ''].filter(Boolean).map((x) => esc(x)).join(' · ');
  return `<li class="listing">
    <div class="listing-head"><div><b>${esc(l.name)}</b><small>${small}</small></div><span class="data">${l.rent ? `CHF ${Number(l.rent).toLocaleString('de-CH')}` : 'auf Anfrage'}</span></div>
    <div class="listing-meta">${meta}</div>
    <div class="listing-fit">${icon('i-check')} Passt für ${names.slice(0, 3).join(', ')}${names.length > 3 ? ` und ${names.length - 3} weitere` : ''}</div>
    <div class="listing-actions"><button type="button" class="btn btn-primary btn-sm" data-adopt="${l.id}">Als Rochade-Wohnung übernehmen</button>${l.url ? `<a class="btn btn-sm" href="${esc(l.url)}" target="_blank" rel="noopener">Inserat ↗</a>` : ''}</div>
  </li>`;
}

function searchResults(project, plan, search) {
  if (search.status === 'idle') return '';
  if (search.status === 'loading') return `<p class="search-state" role="status">${icon('i-swap')} Flatfox wird abgefragt: Mietwohnungen im Umkreis von ${SEARCH_RADIUS_KM} km um die Siedlung, dann Abgleich mit dem Bedarf …</p>`;
  if (search.status === 'error') {
    return `<p class="search-state is-error" role="alert">Flatfox ist gerade nicht erreichbar${search.error ? ` (${esc(search.error)})` : ''}.
      <button type="button" class="btn btn-sm" data-action="search">Nochmals versuchen</button>
      <button type="button" class="btn btn-sm btn-ghost" data-action="search-demo">Beispieltreffer zeigen (fiktiv)</button></p>`;
  }
  const hits = findListings(project, plan, search.items);
  const live = search.source === 'flatfox';
  const head = live
    ? `<span><b>${hits.length} von ${search.loaded}</b> Inseraten im Umkreis von ${SEARCH_RADIUS_KM} km passen zum Bedarf <span class="muted">· flatfox.ch, Stand ${timeLabel(search.fetchedAt)}</span></span>`
    : `<span><b>${hits.length}</b> Beispieltreffer <span class="muted">· fiktiv, ohne Internet</span></span>`;
  const toggle = search.open
    ? '<button type="button" class="btn btn-sm btn-ghost" data-action="search-close">Treffer einklappen</button>'
    : '<button type="button" class="btn btn-sm btn-primary" data-action="search-open">Treffer anzeigen</button>';
  const list = hits.length
    ? `<ul class="listings" aria-label="Gefundene Wohnungen">${hits.map((l) => listingItem(project, l)).join('')}</ul>`
    : `<p class="body-sm muted">Keines der ${search.loaded} geladenen Inserate passt zu diesem Bedarf. Nutzen Sie den KI-Suchauftrag oder die Links; sobald neue Inserate erscheinen, lohnt sich «Neu laden».</p>`;
  const note = live
    ? '<p class="body-sm muted">Echte Inserate aus der öffentlichen Flatfox-Schnittstelle, gefiltert nach Zimmerzahl, Hindernisfreiheit (Lift, rollstuhlgängig oder Parterre), Verfügbarkeit und Distanz zur Siedlung. Ob eine befristete Vermietung möglich ist, klärt die Genossenschaft mit der Anbieterin.</p>'
    : '<p class="body-sm muted">Beispieltreffer, fiktiv. Mit Internet lädt ROCHADE hier echte Inserate von Flatfox.</p>';
  return `<p class="search-meta">${head} ${toggle} <button type="button" class="btn btn-sm btn-ghost" data-action="search">Neu laden</button></p>${search.open ? list + note : ''}`;
}

export function renderStatus(project, plan, applied, diff, lastChanged, { search = IDLE, needsOpen = true } = {}) {
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
  return `<div class="status-panel is-conflict">
    <p class="status-title">${icon('i-alert')} ${plural(n, 'Konflikt', 'Konflikte')} in ${byPhase.map((x) => esc(x.phase.name)).join(' und ')}</p>
    <ul class="conflicts">${plan.conflicts.slice(0, 4).map((c) => conflictItem(project, plan, c)).join('')}${n > 4 ? `<li class="muted">… und ${n - 4} weitere</li>` : ''}</ul>
    <p class="label">Lösung 1 · Etappe verschieben</p>
    <ul class="suggestions">${suggestions}</ul>
    <div class="search"${search.status === 'loading' ? ' aria-busy="true"' : ''}>
      <p class="label">Lösung 2 · Wohnungen ausserhalb der Genossenschaft</p>
      <details class="needs-wrap" ${needsOpen ? 'open' : ''}><summary>Bedarf: ${plural(n, 'Haushalt', 'Haushalte')} in ${plural(needs.length, 'Gruppe', 'Gruppen')}</summary><ul class="needs">${needList}</ul></details>
      <div class="search-actions">
        ${search.status === 'idle' ? '<button type="button" class="btn btn-primary btn-sm" data-action="search">Inserate auf Flatfox suchen</button>' : ''}
        <button type="button" class="btn btn-sm" data-action="copy-prompt">KI-Suchauftrag kopieren</button>
        <span class="search-links">${links}</span>
      </div>
      ${searchResults(project, plan, search)}
      <details class="prompt"><summary>Suchauftrag anzeigen</summary><pre>${esc(prompt)}</pre></details>
    </div>
    ${changedList}
  </div>`;
}
