/* Landing page v3: menu, hero stage with scrubber, pinned scrolly, reveals, counters, live dashboard mock with diff flashes. */
import { PROJECT } from './data.js';
import { planRochade, diffPlans, suggestStart, monthLabel, stateAt } from './planner.js';
import { injectIcons } from './icons.js';
import { createStage } from './stage.js';
import { esc, icon, householdNeed, flatLabelOf } from './views/format.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
injectIcons();

const MONTHS = PROJECT.timeline.months;
const basePlan = planRochade(PROJECT);
const fmtCH = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
const buildingName = (id) => (PROJECT.buildings.find((b) => b.id === id) || {}).name || id;
const awayCount = (plan, m) => { const s = stateAt(PROJECT, plan, m); return s.apartments.filter((a) => a.status === 'temp').length + s.external.filter((e) => e.status === 'temp').length; };

/* Header: mobile menu */
const header = document.getElementById('site-header');
const menuBtn = header && header.querySelector('.menu-btn');
if (menuBtn) {
  const setOpen = (open) => {
    header.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Menü schliessen' : 'Menü öffnen');
  };
  menuBtn.addEventListener('click', () => setOpen(!header.classList.contains('is-open')));
  header.querySelectorAll('.nav a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}

/* Hero: the real plan with play controls and a month scrubber */
const heroRoot = document.getElementById('hero-visual');
if (heroRoot) {
  const stage = createStage(heroRoot, PROJECT, { plan: basePlan, reducedMotion, maxScale: 1.3 });
  const scrub = document.getElementById('hero-scrub');
  const stat = document.getElementById('hero-stat');
  const toggle = document.querySelector('[data-hero="toggle"]');
  const bands = document.getElementById('phase-bands');
  const axis = document.getElementById('scrub-axis');
  if (bands) bands.innerHTML = basePlan.phases.map((p) => `<span style="left:${(p.start / MONTHS) * 100}%;width:${(p.duration / MONTHS) * 100}%"><b>${esc(p.name)}</b> · ${esc(buildingName(p.building))}</span>`).join('');
  if (axis) axis.innerHTML = [0, 5, 10, 15, MONTHS - 1].map((i) => `<span style="left:${(i / (MONTHS - 1)) * 100}%">${esc(monthLabel(PROJECT, i, 'short'))}</span>`).join('');
  let month = 0;
  let timer = null;
  let playing = !reducedMotion;
  const paintStat = (m) => { if (!stat) return; const away = awayCount(basePlan, m); stat.textContent = `Monat ${m + 1} von ${MONTHS} · ${away} ${away === 1 ? 'Haushalt' : 'Haushalte'} in Rochade-Wohnungen · 0 Kündigungen`; };
  const paintToggle = () => {
    if (!toggle) return;
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? 'Pause' : 'Abspielen');
    toggle.innerHTML = `<svg class="icon"><use href="#${playing ? 'i-pause' : 'i-play'}"/></svg>`;
  };
  const go = (m, animate = true) => {
    month = ((m % MONTHS) + MONTHS) % MONTHS;
    stage.setMonth(month, { animate });
    if (scrub) scrub.value = String(month);
    paintStat(month);
  };
  const start = () => { clearInterval(timer); timer = setInterval(() => go(month + 1), 2600); playing = true; paintToggle(); };
  const stop = () => { clearInterval(timer); timer = null; playing = false; paintToggle(); };
  document.getElementById('hero-controls').addEventListener('click', (e) => {
    const b = e.target.closest('[data-hero]');
    if (!b) return;
    if (b.dataset.hero === 'toggle') return playing ? stop() : start();
    stop();
    go(month + (b.dataset.hero === 'next' ? 1 : -1));
  });
  if (scrub) scrub.addEventListener('input', () => { stop(); go(Number(scrub.value)); });
  // First frame: everyone at home. Then the first move plays, so the first thing a visitor sees is motion.
  stage.setMonth(MONTHS - 1, { animate: false });
  paintStat(MONTHS - 1);
  if (scrub) scrub.value = '0';
  setTimeout(() => go(0, true), reducedMotion ? 0 : 1100);
  if ('IntersectionObserver' in window && !reducedMotion) {
    new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting && playing && !timer) start();
      if (!en.isIntersecting && timer) { clearInterval(timer); timer = null; }
    }), { threshold: 0.2 }).observe(heroRoot);
  } else if (playing) start();
  paintToggle();
}

/* Reveal on scroll */
const reveals = document.querySelectorAll('.reveal, .phones, .number, .step');
if ('IntersectionObserver' in window && !reducedMotion) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((el) => io.observe(el));
} else reveals.forEach((el) => el.classList.add('is-in'));

/* Counters: count up once when visible */
const counters = document.querySelectorAll('[data-count]');
if ('IntersectionObserver' in window && !reducedMotion) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    io.unobserve(en.target);
    const target = Number(en.target.dataset.count);
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 1300);
      const eased = 1 - Math.pow(1 - p, 3);
      en.target.textContent = fmtCH(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: 0.5 });
  counters.forEach((el) => io.observe(el));
}

/* Scrolly: the three steps drive a second stage that stays pinned */
const scrollyRoot = document.getElementById('scrolly-visual');
const stepEls = [...document.querySelectorAll('.scrolly-steps .step')];
if (scrollyRoot && stepEls.length && window.matchMedia('(min-width: 1000px)').matches) {
  const shiftedStarts = { P1: 2, P2: 6, P3: 12 };
  const shifted = planRochade(PROJECT, shiftedStarts);
  const fixP2 = suggestStart(PROJECT, shiftedStarts, 'P2');
  const before = planRochade(PROJECT, { P1: 1, P2: 7, P3: 13 });
  const vacant = PROJECT.apartments.length - PROJECT.households.length + PROJECT.external.length;
  const affected = diffPlans(basePlan, shifted).affected.length;
  const label = document.getElementById('scrolly-label');
  const badge = document.getElementById('scrolly-badge');
  const note = document.getElementById('scrolly-note');
  const stage2 = createStage(scrollyRoot, PROJECT, { plan: before, reducedMotion, maxScale: 1.2 });
  const states = [
    { plan: before, month: 0, label: 'Schritt 1 · Erfassen', badge: `${PROJECT.households.length} Haushalte · ${PROJECT.apartments.length} Wohnungen · ${vacant} frei`, conflict: false, note: 'Alle zu Hause. Gestrichelt sind die freien Wohnungen: neun in der Siedlung, zwei ausserhalb. Jede mit Zimmerzahl, Stockwerk und Lift.' },
    { plan: basePlan, month: 1, label: 'Schritt 2 · Planen', badge: `${awayCount(basePlan, 1)} Haushalte in Rochade-Wohnungen · ${basePlan.conflicts.length} Konflikte`, conflict: false, note: 'Haus A wird saniert. Frau Meier braucht hindernisfrei und bekommt das Parterre in Haus C. Wer am meisten braucht, wird zuerst zugeteilt.' },
    { plan: shifted, month: 6, label: 'Schritt 3 · Anpassen', badge: `${shifted.conflicts.length} Konflikte · Vorschlag: Etappe 2 ab ${monthLabel(PROJECT, fixP2)}`, conflict: true, note: `Etappe 1 verzögert sich um zwei Monate und überschneidet Etappe 2: ${affected} Haushalte sind betroffen, rot markiert sind die ohne Wohnung. ROCHADE nennt jeden Konflikt mit Grund und den nächsten Termin, der aufgeht.` },
  ];
  let active = -1;
  const apply = (i) => {
    if (i === active) return;
    active = i;
    const s = states[i];
    stage2.setPlan(s.plan);
    stage2.setMonth(s.month, { animate: true });
    if (label) label.textContent = s.label;
    if (badge) { badge.textContent = s.badge; badge.className = `badge ${s.conflict ? 'badge-conflict' : 'badge-ok'}`; }
    if (note) note.textContent = s.note;
    stepEls.forEach((el, j) => el.classList.toggle('is-active', j === i));
  };
  apply(0);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) apply(Number(en.target.dataset.step)); }), { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    stepEls.forEach((el) => io.observe(el));
  }
}

/* Dashboard mockup: live phases, a small Gantt and assignments from the planner; nudges recalculate and flash what changed */
const mock = document.getElementById('mock-dashboard');
if (mock) {
  const base = Object.fromEntries(PROJECT.phases.map((p) => [p.id, p.start]));
  let starts = { ...base };
  let prevPlan = null;
  const byId = new Map(PROJECT.households.map((h) => [h.id, h]));
  const axisHtml = [0, 5, 10, 15, MONTHS - 1].map((i) => `<span style="left:${(i / (MONTHS - 1)) * 100}%">${esc(monthLabel(PROJECT, i, 'short'))}</span>`).join('');
  const render = () => {
    const plan = planRochade(PROJECT, starts);
    const cards = plan.phases.map((p) => {
      const n = plan.conflicts.filter((c) => c.phaseId === p.id).length;
      return `<div class="mock-phase${starts[p.id] !== base[p.id] ? ' is-shifted' : ''}">
        <b>${esc(p.name)}</b><small>${esc(buildingName(p.building))} · ${p.duration} Monate${n ? ` · <span class="danger">${n} Konflikt${n > 1 ? 'e' : ''}</span>` : ''}</small>
        <span class="date">${esc(monthLabel(PROJECT, p.start, 'short'))} bis ${esc(monthLabel(PROJECT, p.start + p.duration, 'short'))}</span>
        <span class="nudges"><button type="button" data-mock-phase="${p.id}" data-delta="-1" ${p.start <= 0 ? 'disabled' : ''}>‹ −1 Monat</button><button type="button" data-mock-phase="${p.id}" data-delta="1" ${p.start >= MONTHS - p.duration ? 'disabled' : ''}>+1 Monat ›</button></span>
      </div>`;
    }).join('');
    const gantt = plan.phases.map((p) => `<div class="g-row${starts[p.id] !== base[p.id] ? ' is-shifted' : ''}"><span class="g-label">${esc(p.name)} <small>${esc(buildingName(p.building))}</small></span><span class="g-track"><i style="left:${(p.start / MONTHS) * 100}%;width:${(p.duration / MONTHS) * 100}%"></i></span></div>`).join('');
    const rows = plan.assignments.slice(0, 5).map((a) => {
      const h = byId.get(a.householdId);
      return `<tr data-h="${h.id}"><td><b>${esc(h.name)}</b><small>${h.persons} ${h.persons === 1 ? 'Person' : 'Personen'}</small></td><td class="data">${esc(h.apartment)}</td><td>${esc(householdNeed(h))}</td><td class="data">${a.flatId ? esc(flatLabelOf(PROJECT, a.flatId).replace('Whg. ', '')) : '—'}</td><td class="data">${esc(monthLabel(PROJECT, a.from, 'short'))}</td><td class="data">${esc(monthLabel(PROJECT, a.to, 'short'))}</td><td>${a.flatId ? `<span class="status is-ok">${icon('i-check')}Zugeteilt</span>` : `<span class="status is-conflict">${icon('i-alert')}Konflikt</span>`}</td></tr>`;
    }).join('');
    const ok = plan.assignments.length - plan.conflicts.length;
    const dirty = Object.keys(starts).some((k) => starts[k] !== base[k]);
    mock.innerHTML = `<div class="mock-head"><h3>Bauetappen</h3><span class="mock-chips"><span class="body-sm muted">${esc(PROJECT.name)}</span><button type="button" class="mock-reset" data-mock-reset ${dirty ? '' : 'disabled'}>Zurücksetzen</button></span></div>
      <div class="mock-phases">${cards}</div>
      <div class="gantt">${gantt}<div class="g-axis"><i class="g-spacer"></i><div>${axisHtml}</div></div></div>
      <div class="mock-head"><h3>Zuteilungen</h3><span class="mock-chips"><span class="badge badge-ok">${ok} zugeteilt</span>${plan.conflicts.length ? `<span class="badge badge-conflict">${plan.conflicts.length} Konflikt${plan.conflicts.length > 1 ? 'e' : ''}</span>` : ''}</span></div>
      <div class="mock-table-wrap"><table class="mock-table"><thead><tr><th>Haushalt</th><th>Zuhause</th><th>Bedarf</th><th>Rochade-Wohnung</th><th>Auszug</th><th>Rückkehr</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>
      <p class="mock-more">… und ${plan.assignments.length - 5} weitere Haushalte im Prototyp.</p>`;
    if (prevPlan && !reducedMotion) {
      const changed = new Set(diffPlans(prevPlan, plan).affected.map((x) => x.householdId));
      mock.querySelectorAll('tr[data-h]').forEach((tr) => {
        if (!changed.has(tr.dataset.h)) return;
        tr.classList.add('is-changed');
        requestAnimationFrame(() => requestAnimationFrame(() => tr.classList.remove('is-changed')));
      });
    }
    prevPlan = plan;
  };
  mock.addEventListener('click', (e) => {
    if (e.target.closest('[data-mock-reset]')) { starts = { ...base }; render(); return; }
    const b = e.target.closest('button[data-mock-phase]');
    if (!b) return;
    const id = b.dataset.mockPhase;
    const phase = PROJECT.phases.find((p) => p.id === id);
    starts = { ...starts, [id]: Math.min(Math.max(0, starts[id] + Number(b.dataset.delta)), MONTHS - phase.duration) };
    render();
  });
  render();
}
