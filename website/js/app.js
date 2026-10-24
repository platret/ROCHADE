/* ROCHADE prototype page: state, URL sync, events, rendering. State is replaced, never mutated. */
import { PROJECT } from './data.js';
import { planRochade, diffPlans, validateProject } from './planner.js';
import { injectIcons } from './icons.js';
import { initMenu, CHEVRON_LEFT, CHEVRON_RIGHT } from './chrome.js';
import { esc, icon, month, plural } from './views/format.js';
import { renderTimeline, TIMELINE_LEGEND } from './views/timeline.js';
import { renderMoves, BUILDINGS_LEGEND } from './views/buildings.js';
import { createStage } from './stage.js';
import { renderTable } from './views/table.js';
import { renderPhases } from './views/phases.js';
import { renderStatus } from './views/status.js';
import { renderInput } from './views/input.js';
import { addBuilding, removeBuilding, setLift, setRenovate, moveBuilding, addHousehold, removeHousehold, addExternal, removeExternal } from './edit.js';
import { LISTINGS, toExternal, needsFor, searchPrompt } from './listings.js';
import { scheduleProject, rebaseStarts } from './schedule.js';
import { searchFlatfox } from './flatfox.js';

const VIEWS = [
  { id: 'erfassen', name: 'Erfassen' },
  { id: 'zeitplan', name: 'Zeitplan' },
  { id: 'gebaeude', name: 'Gebäude' },
  { id: 'haushalte', name: 'Haushalte' },
];
const PLAY_INTERVAL_MS = 1100;
const IDLE_SEARCH = Object.freeze({ status: 'idle', items: [], loaded: 0, error: null, source: null, fetchedAt: null, open: true });
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const defaultStarts = () => Object.fromEntries(PROJECT.phases.map((p) => [p.id, p.start]));

function readUrl() {
  const q = new URLSearchParams(location.search);
  const starts = defaultStarts();
  for (const p of PROJECT.phases) {
    const v = Number(q.get(p.id.toLowerCase()));
    if (q.has(p.id.toLowerCase()) && Number.isInteger(v)) starts[p.id] = v;
  }
  const view = VIEWS.some((v) => v.id === q.get('view')) ? q.get('view') : 'zeitplan';
  const m = Number(q.get('m'));
  const building = ['all', ...PROJECT.buildings.map((b) => b.id)].includes(q.get('b')) ? q.get('b') : 'all';
  return { starts, view, month: Number.isInteger(m) ? Math.min(Math.max(m, 0), PROJECT.timeline.months - 1) : 0, building };
}

function writeUrl(state) {
  const q = new URLSearchParams();
  for (const p of state.project.phases) if (state.applied[p.id] !== p.start) q.set(p.id.toLowerCase(), state.applied[p.id]);
  if (state.view !== 'zeitplan') q.set('view', state.view);
  if (state.view === 'gebaeude' && state.month) q.set('m', state.month);
  if (state.building !== 'all') q.set('b', state.building);
  const url = `${location.pathname}${q.toString() ? `?${q}` : ''}`;
  history.replaceState(null, '', url);
}

const initial = readUrl();
let state = {
  project: PROJECT,
  applied: initial.starts,
  draft: initial.starts,
  view: initial.view,
  month: initial.month,
  building: initial.building,
  plan: planRochade(PROJECT, initial.starts),
  diff: null,
  changed: new Set(),
  lastChanged: null,
  playing: false,
  search: IDLE_SEARCH,
  needsOpen: true,
};
let timer = null;
let stage = null;

const els = {
  overview: document.getElementById('overview'),
  phases: document.getElementById('phases'),
  status: document.getElementById('status'),
  tabs: document.getElementById('view-tabs'),
  content: document.getElementById('view-content'),
  legend: document.getElementById('view-legend'),
  scrub: document.getElementById('scrubber'),
};

function renderOverview() {
  const { plan, project } = state;
  const next = plan.assignments.filter((a) => a.flatId).map((a) => a.from).sort((a, b) => a - b)[0];
  const nextCount = plan.assignments.filter((a) => a.flatId && a.from === next).length;
  const items = [
    [plan.stats.households, 'Haushalte', `in ${project.buildings.length} Häusern, ${plan.stats.stepFreeNeeds} brauchen es hindernisfrei`],
    [plan.stats.flats, 'Rochade-Wohnungen', `${project.apartments.length - plan.stats.households} in der Siedlung, ${project.external.length} extern`],
    [next === undefined ? '–' : month(project, next, 'short'), 'Nächster Umzug', next === undefined ? '' : `${plural(nextCount, 'Haushalt zieht', 'Haushalte ziehen')} in Rochade-Wohnungen`],
    [plan.conflicts.length, 'Konflikte', plan.conflicts.length ? 'Haushalte ohne passende Wohnung' : 'Alle Haushalte haben eine Wohnung'],
  ];
  els.overview.innerHTML = items.map(([n, label, sub], i) =>
    `<div class="kpi${i === 3 && plan.conflicts.length ? ' is-conflict' : ''}"><dt>${esc(label)}</dt><dd class="kpi-n"><b>${esc(n)}</b></dd><dd class="kpi-sub">${esc(sub)}</dd></div>`).join('');
}

function renderTabs() {
  els.tabs.innerHTML = VIEWS.map((v) =>
    `<button type="button" role="tab" data-view="${v.id}" aria-selected="${state.view === v.id}" id="tab-${v.id}" aria-controls="view-content">${esc(v.name)}</button>`).join('');
}

function renderScrubber() {
  if (state.view !== 'gebaeude') { els.scrub.hidden = true; els.scrub.innerHTML = ''; return; }
  els.scrub.hidden = false;
  const PROJECT = state.project;
  const months = PROJECT.timeline.months;
  const max = months - 1;
  const bands = PROJECT.phases.map((p) => { const b = PROJECT.buildings.find((x) => x.id === p.building); return `<span style="left:${(p.start / months) * 100}%;width:${(p.duration / months) * 100}%"><b>${esc(p.name)}</b> · ${esc(b.name)}</span>`; }).join('');
  const ticks = [...new Set([...Array.from({ length: Math.floor(max / 5) + 1 }, (_, i) => i * 5), max])];
  const axis = ticks.map((i) => `<span style="left:${(i / max) * 100}%">${esc(month(PROJECT, i, 'short'))}</span>`).join('');
  els.scrub.innerHTML = `
    <div class="scrub-buttons">
      <button type="button" class="btn btn-sm btn-icon" data-action="step" data-delta="-1" aria-label="Einen Monat zurück" ${state.month <= 0 ? 'disabled' : ''}>${CHEVRON_LEFT}</button>
      <button type="button" class="btn btn-sm btn-icon" data-action="play" aria-label="${state.playing ? 'Pause' : 'Abspielen'}" aria-pressed="${state.playing}">${icon(state.playing ? 'i-pause' : 'i-play')}</button>
      <button type="button" class="btn btn-sm btn-icon" data-action="step" data-delta="1" aria-label="Einen Monat weiter" ${state.month >= max ? 'disabled' : ''}>${CHEVRON_RIGHT}</button>
    </div>
    <label class="scrub-label" for="month-range"><span class="k">Monat ${state.month + 1} von ${months}</span><output class="data" for="month-range" aria-live="off">${esc(month(PROJECT, state.month))}</output></label>
    <div class="scrub-track">
      <div class="phase-bands" aria-hidden="true">${bands}</div>
      <input id="month-range" type="range" min="0" max="${max}" value="${state.month}" aria-valuetext="${esc(month(PROJECT, state.month))}">
      <div class="scrub-axis data" aria-hidden="true">${axis}</div>
    </div>`;
}

function renderContent() {
  const project = state.project;
  const opts = { changed: state.changed, building: state.building };
  if (state.view === 'erfassen') {
    els.content.innerHTML = renderInput(project, state.applied);
    els.legend.innerHTML = '';
  } else if (state.view === 'zeitplan') {
    els.content.innerHTML = renderTimeline(project, state.plan, opts);
    els.legend.innerHTML = TIMELINE_LEGEND;
  } else if (state.view === 'gebaeude') {
    if (!stage || !els.content.contains(stage.root) || stage.project !== project) {
      els.content.innerHTML = '<div class="stage-frame"><div id="stage-root"></div></div><div id="stage-moves"></div>';
      const root = els.content.querySelector('#stage-root');
      stage = { root, project, api: createStage(root, project, { plan: state.plan, reducedMotion }) };
      stage.api.setMonth(state.month, { animate: false });
    } else {
      stage.api.setPlan(state.plan);
      stage.api.setMonth(state.month, { animate: !reducedMotion });
    }
    els.content.querySelector('#stage-moves').innerHTML = renderMoves(project, state.plan, state.month);
    els.legend.innerHTML = BUILDINGS_LEGEND;
  } else {
    els.content.innerHTML = renderTable(project, state.plan, opts);
    els.legend.innerHTML = '';
  }
  els.content.setAttribute('aria-labelledby', `tab-${state.view}`);
}

/* Re-rendering with innerHTML drops keyboard focus; remember what had focus and give it back. */
function focusKey(el) {
  if (!el || el === document.body) return null;
  const d = el.dataset || {};
  if (d.phase && d.delta) return `button[data-phase="${d.phase}"][data-delta="${d.delta}"]`;
  if (d.applyPhase) return `button[data-apply-phase="${d.applyPhase}"]`;
  if (d.view) return `button[data-view="${d.view}"]`;
  if (d.filterBuilding) return `button[data-filter-building="${d.filterBuilding}"]`;
  if (d.action) return `button[data-action="${d.action}"]`;
  if (d.adopt) return `button[data-action="search"], .listing .btn`;
  if (d.moveBuilding && d.delta) return `button[data-move-building="${d.moveBuilding}"][data-delta="${d.delta}"]`;
  if (d.lift) return `input[data-lift="${d.lift}"]`;
  if (d.renovate) return `input[data-renovate="${d.renovate}"]`;
  if (el.id) return `#${el.id}`;
  return null;
}

function render() {
  const key = focusKey(document.activeElement);
  renderOverview();
  els.phases.innerHTML = renderPhases(state.project, state.applied, state.draft, state.plan);
  els.status.innerHTML = renderStatus(state.project, state.plan, state.applied, state.diff, state.lastChanged, { search: state.search, needsOpen: state.needsOpen });
  renderTabs();
  renderScrubber();
  renderContent();
  writeUrl(state);
  const target = key && document.querySelector(key);
  if (target && !target.disabled) target.focus({ preventScroll: true });
}

function setState(patch) {
  state = { ...state, ...patch };
  render();
}

function pulseStatus() { els.status.classList.add('is-pulse'); setTimeout(() => els.status.classList.remove('is-pulse'), 1600); }

/* Every edit re-plans the Etappen automatically; manual shifts are kept relative to the automatic start. */
function setProject(raw) {
  const project = scheduleProject(raw);
  const errors = validateProject(project);
  if (errors.length) { console.warn('Projekt ungültig', errors); return; }
  const applied = rebaseStarts(state.project, state.applied, project);
  const plan = planRochade(project, applied);
  const diff = diffPlans(state.plan, plan);
  setState({ project, applied, draft: applied, plan, diff, changed: new Set(diff.affected.map((x) => x.householdId)), lastChanged: null, month: Math.min(state.month, project.timeline.months - 1) });
  pulseStatus();
}

/* Live search for external flats on Flatfox; only area, category and rooms leave the browser. */
let searchSeq = 0;
async function runSearch() {
  const seq = ++searchSeq;
  setState({ search: { ...IDLE_SEARCH, status: 'loading' } });
  const needs = needsFor(state.project, state.plan);
  const minRooms = needs.length ? Math.min(...needs.map((n) => n.roomsMin)) : null;
  try {
    const result = await searchFlatfox(state.project, { minRooms });
    if (seq !== searchSeq) return;
    setState({ search: { status: 'ready', items: result.items, loaded: result.loaded, error: null, source: 'flatfox', fetchedAt: Date.now(), open: true } });
  } catch (err) {
    if (seq !== searchSeq) return;
    console.warn('Flatfox-Suche fehlgeschlagen', err);
    setState({ search: { ...IDLE_SEARCH, status: 'error', error: err instanceof Error ? err.message : String(err) } });
  }
}

function recalc(starts, lastChanged) {
  const plan = planRochade(state.project, starts);
  const diff = diffPlans(state.plan, plan);
  setState({ applied: starts, draft: starts, plan, diff, changed: new Set(diff.affected.map((x) => x.householdId)), lastChanged });
}

function stopPlaying() {
  if (timer) clearInterval(timer);
  timer = null;
  if (state.playing) setState({ playing: false });
}

function startPlaying() {
  stopPlaying();
  timer = setInterval(() => {
    const next = state.month + 1;
    if (next >= state.project.timeline.months) { stopPlaying(); return; }
    setState({ month: next });
  }, PLAY_INTERVAL_MS);
  setState({ playing: true });
}

document.addEventListener('click', (e) => {
  const nudge = e.target.closest('button.nudge[data-phase]');
  if (nudge) {
    const id = nudge.dataset.phase;
    const phase = state.project.phases.find((p) => p.id === id);
    const max = state.project.timeline.months - phase.duration;
    const next = Math.min(Math.max(state.applied[id] + Number(nudge.dataset.delta), 0), max);
    recalc({ ...state.applied, [id]: next }, id);
    return;
  }
  const apply = e.target.closest('button[data-apply-phase]');
  if (apply) {
    recalc({ ...state.applied, [apply.dataset.applyPhase]: Number(apply.dataset.applyStart) }, apply.dataset.applyPhase);
    return;
  }
  const tab = e.target.closest('button[data-view]');
  if (tab) { stopPlaying(); els.content.classList.remove('is-fade'); void els.content.offsetWidth; els.content.classList.add('is-fade'); setState({ view: tab.dataset.view }); return; }
  const filter = e.target.closest('button[data-filter-building]');
  if (filter) { setState({ building: filter.dataset.filterBuilding }); return; }
  const mv = e.target.closest('button[data-move-building]');
  if (mv) { setProject(moveBuilding(state.project, mv.dataset.moveBuilding, mv.dataset.delta)); return; }
  const rb = e.target.closest('button[data-remove-building]');
  if (rb) { setProject(removeBuilding(state.project, rb.dataset.removeBuilding)); return; }
  const rh = e.target.closest('button[data-remove-household]');
  if (rh) { setProject(removeHousehold(state.project, rh.dataset.removeHousehold)); return; }
  const re = e.target.closest('button[data-remove-external]');
  if (re) { setProject(removeExternal(state.project, re.dataset.removeExternal)); return; }
  const adopt = e.target.closest('button[data-adopt]');
  if (adopt) {
    const listing = state.search.items.find((l) => l.id === adopt.dataset.adopt);
    if (listing) setProject(addExternal(state.project, toExternal(listing)));
    return;
  }
  const action = e.target.closest('button[data-action]');
  if (!action) return;
  if (action.dataset.action === 'recalc') recalc(state.draft, state.lastChanged);
  if (action.dataset.action === 'discard') setState({ draft: state.applied });
  if (action.dataset.action === 'reset') { state = { ...state, project: PROJECT, search: IDLE_SEARCH }; stage = null; recalc(defaultStarts(), null); }
  if (action.dataset.action === 'play') (state.playing ? stopPlaying() : startPlaying());
  if (action.dataset.action === 'step') { stopPlaying(); setState({ month: Math.min(Math.max(state.month + Number(action.dataset.delta), 0), state.project.timeline.months - 1) }); }
  if (action.dataset.action === 'demo') runDemo();
  if (action.dataset.action === 'search') runSearch();
  if (action.dataset.action === 'search-demo') setState({ search: { status: 'ready', items: LISTINGS, loaded: LISTINGS.length, error: null, source: 'demo', fetchedAt: Date.now(), open: true } });
  if (action.dataset.action === 'search-close') setState({ search: { ...state.search, open: false } });
  if (action.dataset.action === 'search-open') setState({ search: { ...state.search, open: true } });
  if (action.dataset.action === 'copy-prompt') {
    const text = searchPrompt(state.project, needsFor(state.project, state.plan));
    const done = () => { action.textContent = 'Kopiert'; setTimeout(() => { action.textContent = 'KI-Suchauftrag kopieren'; }, 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => { action.textContent = 'Bitte unten kopieren'; });
    else action.textContent = 'Bitte unten kopieren';
  }
});

/* Guided example: delay Etappe 1 by two months; every step is recalculated automatically. */
function runDemo() {
  stopPlaying();
  const base = defaultStarts();
  setState({ project: PROJECT, applied: base, draft: base, plan: planRochade(PROJECT, base), diff: null, changed: new Set(), lastChanged: null, view: 'zeitplan' });
  stage = null;
  els.phases.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  const wait = reducedMotion ? 0 : 700;
  setTimeout(() => recalc({ ...base, P1: 1 }, 'P1'), wait);
  setTimeout(() => { recalc({ ...base, P1: 2 }, 'P1'); pulseStatus(); }, wait * 2 + 200);
}

/* Forms of the Erfassen view: the cooperative enters buildings, households and external flats. */
document.addEventListener('submit', (e) => {
  const form = e.target.closest('form[data-form]');
  if (!form) return;
  e.preventDefault();
  const fd = new FormData(form);
  const data = Object.fromEntries(fd.entries());
  data.lift = fd.has('lift'); data.stepFree = fd.has('stepFree');
  const kind = form.dataset.form;
  data.renovate = fd.has('renovate');
  if (kind === 'building') setProject(addBuilding(state.project, data));
  if (kind === 'household') setProject(addHousehold(state.project, data));
  if (kind === 'external') setProject(addExternal(state.project, { ...data, availableTo: data.availableTo === '' ? '' : Number(data.availableTo) + 1 }));
});
document.addEventListener('change', (e) => {
  if (e.target.matches('input[data-lift]')) setProject(setLift(state.project, e.target.dataset.lift, e.target.checked));
  if (e.target.matches('input[data-renovate]')) setProject(setRenovate(state.project, e.target.dataset.renovate, e.target.checked));
});

/* The needs list is a native <details>; remember its state across re-renders without re-rendering. */
document.addEventListener('toggle', (e) => {
  if (e.target.matches && e.target.matches('details.needs-wrap')) state = { ...state, needsOpen: e.target.open };
}, true);

document.addEventListener('input', (e) => {
  if (e.target.id === 'month-range') { stopPlaying(); setState({ month: Number(e.target.value) }); }
});

let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (state.view === 'gebaeude' && stage) stage.api.fit();
  }, 120);
});

const errors = validateProject(PROJECT);
if (errors.length) {
  els.status.innerHTML = `<div class="status-panel is-conflict" role="alert"><p class="status-title">Beispieldaten ungültig</p><ul>${errors.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
} else {
  injectIcons();
  initMenu();
  render();
  if (!reducedMotion && state.view === 'gebaeude' && state.month === 0) startPlaying();
}
