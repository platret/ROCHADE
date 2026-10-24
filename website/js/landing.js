/* Landing page: hero stage with autoplay, scroll reveals, counters, and two live fragments from the planner. */
import { PROJECT } from './data.js';
import { planRochade, diffPlans, suggestStart, monthLabel } from './planner.js';
import { injectIcons } from './icons.js';
import { createStage } from './stage.js';
import { esc, icon, householdNeed, flatLabelOf } from './views/format.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
injectIcons();

/* Hero: the real plan, one month every 2.4 s, paused when scrolled away */
const heroRoot = document.getElementById('hero-visual');
if (heroRoot) {
  const plan = planRochade(PROJECT);
  const stage = createStage(heroRoot, PROJECT, { plan, reducedMotion });
  const months = PROJECT.timeline.months;
  const toggle = document.querySelector('[data-hero="toggle"]');
  let month = 0;
  let timer = null;
  let playing = !reducedMotion;
  const paintToggle = () => {
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? 'Pause' : 'Abspielen');
    toggle.innerHTML = `<svg class="icon"><use href="#${playing ? 'i-pause' : 'i-play'}"/></svg>`;
  };
  const step = (delta) => { month = ((month + delta) % months + months) % months; stage.setMonth(month, { animate: true }); };
  const start = () => { if (timer) clearInterval(timer); timer = setInterval(() => step(1), 2400); playing = true; paintToggle(); };
  const stop = () => { if (timer) clearInterval(timer); timer = null; playing = false; paintToggle(); };
  document.getElementById('hero-controls').addEventListener('click', (e) => {
    const b = e.target.closest('[data-hero]');
    if (!b) return;
    if (b.dataset.hero === 'toggle') return playing ? stop() : start();
    stop();
    step(b.dataset.hero === 'next' ? 1 : -1);
  });
  if ('IntersectionObserver' in window && !reducedMotion) {
    new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting && playing && !timer) start();
      if (!en.isIntersecting && timer) { clearInterval(timer); timer = null; }
    }), { threshold: 0.25 }).observe(heroRoot);
  } else if (playing) start();
  paintToggle();
  stage.setMonth(0, { animate: false });
}

/* Reveal on scroll */
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((el) => io.observe(el));
} else reveals.forEach((el) => el.classList.add('is-in'));

/* Counters: count up once when visible */
const fmtCH = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
const counters = document.querySelectorAll('[data-count]');
if ('IntersectionObserver' in window && !reducedMotion) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    io.unobserve(en.target);
    const target = Number(en.target.dataset.count);
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 1100);
      const eased = 1 - Math.pow(1 - p, 3);
      en.target.textContent = fmtCH(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: 0.5 });
  counters.forEach((el) => io.observe(el));
}

/* Dashboard mockup: live phases and assignments from the planner, the nudges really recalculate */
const mock = document.getElementById('mock-dashboard');
if (mock) {
  const base = Object.fromEntries(PROJECT.phases.map((p) => [p.id, p.start]));
  let starts = { ...base };
  const months = PROJECT.timeline.months;
  const render = () => {
    const plan = planRochade(PROJECT, starts);
    const byId = new Map(PROJECT.households.map((h) => [h.id, h]));
    const cards = plan.phases.map((p) => {
      const b = PROJECT.buildings.find((x) => x.id === p.building);
      const n = plan.conflicts.filter((c) => c.phaseId === p.id).length;
      return `<div class="mock-phase${starts[p.id] !== base[p.id] ? ' is-shifted' : ''}">
        <b>${esc(p.name)}</b><small>${esc(b.name)} · ${p.duration} Monate${n ? ` · <span class="danger">${n} Konflikt${n > 1 ? 'e' : ''}</span>` : ''}</small>
        <span class="date">${esc(monthLabel(PROJECT, p.start, 'short'))} bis ${esc(monthLabel(PROJECT, p.start + p.duration, 'short'))}</span>
        <span class="nudges"><button type="button" data-mock-phase="${p.id}" data-delta="-1" ${p.start <= 0 ? 'disabled' : ''}>‹ −1 Monat</button><button type="button" data-mock-phase="${p.id}" data-delta="1" ${p.start >= months - p.duration ? 'disabled' : ''}>+1 Monat ›</button></span>
      </div>`;
    }).join('');
    const rows = plan.assignments.slice(0, 5).map((a) => {
      const h = byId.get(a.householdId);
      return `<tr><td><b>${esc(h.name)}</b><small>${h.persons} ${h.persons === 1 ? 'Person' : 'Personen'}</small></td><td class="data">${esc(h.apartment)}</td><td>${esc(householdNeed(h))}</td><td class="data">${a.flatId ? esc(flatLabelOf(PROJECT, a.flatId).replace('Whg. ', '')) : '—'}</td><td class="data">${esc(monthLabel(PROJECT, a.from, 'short'))}</td><td class="data">${esc(monthLabel(PROJECT, a.to, 'short'))}</td><td>${a.flatId ? `<span class="status is-ok">${icon('i-check')}Zugeteilt</span>` : `<span class="status is-conflict">${icon('i-alert')}Konflikt</span>`}</td></tr>`;
    }).join('');
    const ok = plan.assignments.length - plan.conflicts.length;
    mock.innerHTML = `<div class="mock-head"><h3>Bauetappen</h3><span class="body-sm muted">${esc(PROJECT.name)}</span></div>
      <div class="mock-phases">${cards}</div>
      <div class="mock-head"><h3>Zuteilungen</h3><span class="mock-chips"><span class="badge badge-ok">${ok} zugeteilt</span>${plan.conflicts.length ? `<span class="badge badge-conflict">${plan.conflicts.length} Konflikt${plan.conflicts.length > 1 ? 'e' : ''}</span>` : ''}</span></div>
      <table class="mock-table"><thead><tr><th>Haushalt</th><th>Zuhause</th><th>Bedarf</th><th>Rochade-Wohnung</th><th>Auszug</th><th>Rückkehr</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="mock-more">… und ${plan.assignments.length - 5} weitere Haushalte im Prototyp.</p>`;
  };
  mock.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-mock-phase]');
    if (!b) return;
    const id = b.dataset.mockPhase;
    const phase = PROJECT.phases.find((p) => p.id === id);
    starts = { ...starts, [id]: Math.min(Math.max(0, starts[id] + Number(b.dataset.delta)), months - phase.duration) };
    render();
  });
  render();
}
