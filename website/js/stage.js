/* Stage: the Siedlung as building cards with named household chips that visibly move out and back.
   One component for the hero explainer and the prototype's Gebäude view. Only transform and opacity animate.
   Responsive: one row of cards on wide screens, two columns on tablets, stacked on phones. */
import { stateAt, monthLabel, phaseWindow } from './planner.js';

const SLOT_W = 78;
const SLOT_H = 32;
const GAP = 6;
const PAD = 12;
const HEAD_H = 46;
const CARD_GAP = 18;
const COLS = 3;
const STAGGER_MS = 110;
const MOVE_MS = 700;
const MODE_BREAKS = [[900, 'row'], [560, 'grid2'], [0, 'stack']];

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function buildLayout(project, mode) {
  const floors = [...new Set(project.apartments.map((a) => a.floor))].sort((a, b) => b - a);
  const rows = floors.length;
  const cardW = COLS * SLOT_W + (COLS - 1) * GAP + 2 * PAD;
  const cardH = HEAD_H + rows * SLOT_H + (rows - 1) * GAP + PAD;
  const extW = mode === 'row' ? SLOT_W + 2 * PAD : cardW;
  const defs = [
    ...project.buildings.map((b) => ({ id: b.id, name: b.name, sub: b.lift ? 'mit Lift' : 'ohne Lift', w: cardW, h: cardH })),
    { id: 'EXT', name: 'Externe Rochade-Wohnungen', sub: 'ausserhalb der Siedlung', w: extW, h: mode === 'row' ? cardH : HEAD_H + SLOT_H + PAD },
  ];
  const perRow = mode === 'row' ? defs.length : mode === 'grid2' ? 2 : 1;
  let x = 0; let y = 0; let rowH = 0;
  const cards = defs.map((d, i) => {
    if (i > 0 && i % perRow === 0) { x = 0; y += rowH + CARD_GAP; rowH = 0; }
    const card = { ...d, x, y };
    x += d.w + CARD_GAP; rowH = Math.max(rowH, d.h);
    return card;
  });
  const slots = new Map();
  project.buildings.forEach((b, bi) => {
    const card = cards[bi];
    const byFloor = new Map();
    project.apartments.filter((a) => a.building === b.id).forEach((a) => byFloor.set(a.floor, [...(byFloor.get(a.floor) || []), a]));
    for (const [floor, list] of byFloor) {
      list.forEach((a, ci) => slots.set(a.id, { x: card.x + PAD + ci * (SLOT_W + GAP), y: card.y + HEAD_H + floors.indexOf(floor) * (SLOT_H + GAP) }));
    }
  });
  const ext = cards[cards.length - 1];
  project.external.forEach((e, i) => {
    if (mode === 'row') slots.set(e.id, { x: ext.x + PAD, y: ext.y + HEAD_H + (rows - 1 - i) * (SLOT_H + GAP) });
    else slots.set(e.id, { x: ext.x + PAD + i * (SLOT_W + GAP), y: ext.y + HEAD_H });
  });
  const width = Math.max(...cards.map((c) => c.x + c.w));
  const height = Math.max(...cards.map((c) => c.y + c.h));
  return { cards, slots, width, height };
}

const shortName = (h) => h.short || h.name.replace(/^(Frau|Hr\.|Fam\.|Hr\. und Frau)\s+/, '');

export function createStage(root, project, { plan, reducedMotion = false, maxScale = 1 } = {}) {
  let currentPlan = plan;
  let month = 0;
  let mode = null;
  let lay = null;
  let stage, scaleBox, caption, tokenEls, slotEls, cardEls;
  const households = project.households;

  function mount(nextMode) {
    mode = nextMode;
    lay = buildLayout(project, mode);
    const cardsHtml = lay.cards.map((c) => `<div class="st-card" data-building="${c.id}" style="left:${c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px">
        <div class="st-head"><b>${esc(c.name)}</b><span class="st-badge" data-badge></span><small>${esc(c.sub)}</small></div></div>`).join('');
    const slotsHtml = [...lay.slots.entries()].map(([id, p]) => `<div class="st-slot" data-slot="${esc(id)}" style="left:${p.x}px;top:${p.y}px;width:${SLOT_W}px;height:${SLOT_H}px"><span>${esc(id.replace(/^[A-Z]-/, ''))}</span></div>`).join('');
    const tokensHtml = households.map((h) => `<div class="st-token" data-token="${h.id}" style="width:${SLOT_W}px;height:${SLOT_H}px" title="${esc(h.name)}">${esc(shortName(h))}</div>`).join('');
    root.classList.add('st-root');
    root.innerHTML = `<div class="st-scale"><div class="stage no-anim" style="width:${lay.width}px;height:${lay.height}px" aria-hidden="true">${cardsHtml}${slotsHtml}<div class="st-tokens">${tokensHtml}</div></div></div>
      <p class="st-caption" aria-live="polite"></p>`;
    stage = root.querySelector('.stage');
    scaleBox = root.querySelector('.st-scale');
    caption = root.querySelector('.st-caption');
    tokenEls = new Map(households.map((h) => [h.id, stage.querySelector(`[data-token="${h.id}"]`)]));
    slotEls = new Map([...lay.slots.keys()].map((id) => [id, stage.querySelector(`[data-slot="${CSS.escape(id)}"]`)]));
    cardEls = new Map(lay.cards.map((c) => [c.id, stage.querySelector(`[data-building="${c.id}"]`)]));
  }

  function modeFor(width) { return MODE_BREAKS.find(([min]) => width >= min)[1]; }

  function fit() {
    const w = root.clientWidth || lay.width;
    const next = modeFor(w);
    if (next !== mode) { mount(next); render(month, false); }
    const s = Math.min(maxScale, w / lay.width);
    stage.style.transform = `scale(${s})`;
    scaleBox.style.height = `${Math.round(lay.height * s)}px`;
  }

  function captionFor(m) {
    const s = stateAt(project, currentPlan, m);
    const label = monthLabel(project, m);
    const buildingsOf = (ids) => [...new Set(ids.map((id) => project.apartments.find((a) => a.id === households.find((h) => h.id === id).apartment).building))]
      .map((b) => project.buildings.find((x) => x.id === b).name).join(' und ');
    if (s.moves.out.length && s.moves.back.length) return `${label}: ${s.moves.back.length} Haushalte kommen zurück, ${s.moves.out.length} ziehen in Rochade-Wohnungen.`;
    if (s.moves.out.length) return `${label}: ${buildingsOf(s.moves.out.map((x) => x.householdId))} wird saniert. ${s.moves.out.length} Haushalte ziehen in freie Wohnungen.`;
    if (s.moves.back.length) return `${label}: ${buildingsOf(s.moves.back.map((x) => x.householdId))} ist saniert. ${s.moves.back.length} Haushalte kommen nach Hause.`;
    const renovating = project.buildings.filter((b) => s.apartments.some((a) => a.building === b.id && a.status === 'renovation'));
    const away = s.apartments.filter((a) => a.status === 'temp').length + s.external.filter((e) => e.status === 'temp').length;
    if (renovating.length) return `${label}: ${renovating.map((b) => b.name).join(', ')} in Sanierung. ${away} Haushalte wohnen vorübergehend in Rochade-Wohnungen.`;
    return `${label}: Keine Sanierung, alle ${households.length} Haushalte zu Hause. 0 Kündigungen.`;
  }

  function render(m, animate) {
    const s = stateAt(project, currentPlan, m);
    const aptState = new Map(s.apartments.map((a) => [a.id, a]));
    const extState = new Map(s.external.map((e) => [e.id, e]));
    const moving = new Set([...s.moves.out, ...s.moves.back].map((x) => x.householdId));
    for (const [id, el] of slotEls) {
      const st = aptState.get(id) || extState.get(id);
      el.className = `st-slot is-${st ? st.status : 'vacant'}`;
    }
    for (const b of project.buildings) {
      const phase = currentPlan.phases.find((p) => p.building === b.id);
      const { start, end } = phaseWindow(phase);
      const card = cardEls.get(b.id);
      card.classList.toggle('is-renovating', m >= start && m < end);
      card.classList.toggle('is-done', m >= end);
      card.querySelector('[data-badge]').textContent = m >= start && m < end ? 'In Sanierung' : m >= end ? 'Saniert' : '';
    }
    let i = 0;
    for (const h of households) {
      const el = tokenEls.get(h.id);
      const home = aptState.get(h.apartment);
      const a = currentPlan.assignments.find((x) => x.householdId === h.id);
      const away = home && home.status === 'renovation' && a && a.flatId && m >= a.from && m < a.to;
      const conflict = home && home.status === 'renovation' && !(a && a.flatId);
      const target = away ? lay.slots.get(a.flatId) : lay.slots.get(h.apartment);
      el.style.transitionDelay = animate && moving.has(h.id) ? `${(i++) * STAGGER_MS}ms` : '0ms';
      el.style.transform = `translate(${target.x}px, ${target.y}px)`;
      el.className = `st-token${away ? ' is-away' : ''}${conflict ? ' is-conflict' : ''}${moving.has(h.id) && animate ? ' is-moving' : ''}`;
    }
    caption.textContent = captionFor(m);
  }

  function setMonth(m, { animate = true } = {}) {
    month = Math.min(Math.max(0, m), project.timeline.months - 1);
    stage.classList.toggle('no-anim', reducedMotion || !animate);
    if (reducedMotion || !animate) void stage.offsetWidth;
    render(month, animate && !reducedMotion);
  }

  function setPlan(nextPlan) { currentPlan = nextPlan; render(month, false); }

  mount(modeFor(root.clientWidth || 1200));
  render(0, false);
  fit();
  requestAnimationFrame(() => stage.classList.remove('no-anim'));
  if ('ResizeObserver' in window) new ResizeObserver(() => fit()).observe(root); else window.addEventListener('resize', fit);
  return { setMonth, setPlan, fit, getMonth: () => month, moveDuration: MOVE_MS + households.length * STAGGER_MS };
}
