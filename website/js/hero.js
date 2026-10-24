/* Hero visualisation: the Siedlung as an occupancy grid (the mark at building scale), driven by the real plan.
   Cells: ink = at home, hollow = in renovation, slate = in a Rochade-Wohnung, dashed = free.
   The Zug: an orange bar, one gutter wide, drawn along the gutters from the flat a household leaves to the flat it enters. */
import { stateAt, planRochade, monthLabel } from './planner.js';

const CELL = 36;
const GUTTER = 12;
const BLOCK_GAP = 36;
const LABEL_H = 28;
const STEP = CELL + GUTTER;
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

function layout(project) {
  const floors = [...new Set(project.apartments.map((a) => a.floor))].sort((a, b) => b - a);
  const rows = floors.length;
  const cols = Math.max(...project.buildings.map((b) => new Set(project.apartments.filter((a) => a.building === b.id).map((a) => a.id)).size)) >= 11 ? 3 : 3;
  const blockW = cols * CELL + (cols - 1) * GUTTER;
  const pos = new Map();
  project.buildings.forEach((b, bi) => {
    const x0 = bi * (blockW + BLOCK_GAP);
    const byFloor = new Map();
    project.apartments.filter((a) => a.building === b.id).forEach((a) => {
      const list = byFloor.get(a.floor) || [];
      byFloor.set(a.floor, [...list, a]);
    });
    for (const [floor, list] of byFloor) {
      list.forEach((a, ci) => pos.set(a.id, { x: x0 + ci * STEP, y: LABEL_H + floors.indexOf(floor) * STEP }));
    }
  });
  const extX = project.buildings.length * (blockW + BLOCK_GAP);
  project.external.forEach((e, i) => pos.set(e.id, { x: extX, y: LABEL_H + (rows - 1 - i) * STEP }));
  const width = extX + CELL;
  const height = LABEL_H + rows * STEP - GUTTER;
  const blocks = project.buildings.map((b, bi) => ({ id: b.id, name: b.name, x: bi * (blockW + BLOCK_GAP), w: blockW }));
  return { pos, width, height, blocks, extX };
}

const junction = (p) => ({ x: p.x + CELL + GUTTER / 2, y: p.y - GUTTER / 2 });

function routePath(from, to) {
  const a = junction(from);
  const b = junction(to);
  if (Math.abs(a.x - b.x) < 1) return `M${a.x},${a.y} V${b.y}`;
  return `M${a.x},${a.y} H${b.x} V${b.y}`;
}

function svgMarkup(project, lay) {
  const cells = [...project.apartments.map((a) => a.id), ...project.external.map((e) => e.id)].map((id) => {
    const p = lay.pos.get(id);
    return `<rect class="hc" data-cell="${id}" x="${p.x}" y="${p.y}" width="${CELL}" height="${CELL}"/>`;
  }).join('');
  const labels = lay.blocks.map((b) => `<text class="hl" x="${b.x}" y="16">${b.name}</text>`).join('') +
    `<text class="hl" x="${lay.extX}" y="16">Extern</text>`;
  return `<svg class="hero-grid" viewBox="0 0 ${lay.width} ${lay.height}" width="${lay.width}" height="${lay.height}" aria-hidden="true" focusable="false">
    <g class="hero-cells">${cells}</g>
    <g class="hero-paths"></g>
    ${labels}
  </svg>`;
}

function caption(project, plan, month) {
  const s = stateAt(project, plan, month);
  const inTemp = s.apartments.filter((a) => a.status === 'temp').length + s.external.filter((e) => e.status === 'temp').length;
  const renovating = project.buildings.filter((b) => s.apartments.some((a) => a.building === b.id && a.status === 'renovation')).map((b) => b.name);
  const phase = renovating.length ? `${renovating.join(', ')} in Sanierung` : 'Keine Sanierung';
  return `${monthLabel(project, month)} · ${phase} · ${inTemp} Haushalte in Rochade-Wohnungen · 0 Kündigungen`;
}

export function mountHero(root, project, { reducedMotion = false, interval = 2200 } = {}) {
  const plan = planRochade(project);
  const lay = layout(project);
  const households = new Map(project.households.map((h) => [h.id, h]));
  root.innerHTML = `${svgMarkup(project, lay)}
    <p class="hero-caption data" aria-live="polite"></p>
    <div class="hero-controls">
      <button type="button" class="btn btn-sm btn-icon" data-hero="prev" aria-label="Einen Monat zurück"><svg class="icon"><use href="#i-minus"/></svg></button>
      <button type="button" class="btn btn-sm btn-icon" data-hero="toggle" aria-label="Pause" aria-pressed="true"><svg class="icon"><use href="#i-pause"/></svg></button>
      <button type="button" class="btn btn-sm btn-icon" data-hero="next" aria-label="Einen Monat weiter"><svg class="icon"><use href="#i-plus"/></svg></button>
    </div>`;
  const svg = root.querySelector('svg');
  const paths = svg.querySelector('.hero-paths');
  const cap = root.querySelector('.hero-caption');
  const toggle = root.querySelector('[data-hero="toggle"]');
  const months = project.timeline.months;
  let month = 0;
  let playing = !reducedMotion;
  let timer = null;
  let token = 0;

  const paint = (m) => {
    const s = stateAt(project, plan, m);
    for (const a of s.apartments) svg.querySelector(`[data-cell="${a.id}"]`).setAttribute('class', `hc is-${a.status}`);
    for (const e of s.external) svg.querySelector(`[data-cell="${e.id}"]`).setAttribute('class', `hc is-${e.status}`);
    cap.textContent = caption(project, plan, m);
  };

  const drawMoves = (m, instant) => {
    const s = stateAt(project, plan, m);
    const moves = [
      ...s.moves.out.map((x) => ({ from: households.get(x.householdId).apartment, to: x.flatId })),
      ...s.moves.back.map((x) => ({ from: x.flatId, to: households.get(x.householdId).apartment })),
    ];
    paths.innerHTML = moves.map((mv, i) =>
      `<path class="hp" d="${routePath(lay.pos.get(mv.from), lay.pos.get(mv.to))}" style="--i:${i}"/>`).join('');
    if (instant) return;
    paths.querySelectorAll('path').forEach((p, i) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
      p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 320, delay: i * 110, easing: EASE, fill: 'forwards' });
    });
  };

  const show = (m, { animate = true } = {}) => {
    month = ((m % months) + months) % months;
    const my = ++token;
    const s = stateAt(project, plan, month);
    const hasMoves = s.moves.out.length + s.moves.back.length > 0;
    if (!animate || reducedMotion || !hasMoves) { paint(month); drawMoves(month, true); return; }
    drawMoves(month, false);
    const total = 320 + (s.moves.out.length + s.moves.back.length) * 110;
    setTimeout(() => { if (my === token) paint(month); }, total);
  };

  const stop = () => { if (timer) clearInterval(timer); timer = null; playing = false; toggle.setAttribute('aria-pressed', 'false'); toggle.setAttribute('aria-label', 'Abspielen'); toggle.innerHTML = '<svg class="icon"><use href="#i-play"/></svg>'; };
  const start = () => { stop(); playing = true; toggle.setAttribute('aria-pressed', 'true'); toggle.setAttribute('aria-label', 'Pause'); toggle.innerHTML = '<svg class="icon"><use href="#i-pause"/></svg>'; timer = setInterval(() => show(month + 1), interval); };

  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-hero]');
    if (!b) return;
    if (b.dataset.hero === 'toggle') return playing ? stop() : start();
    stop();
    show(month + (b.dataset.hero === 'next' ? 1 : -1), { animate: !reducedMotion });
  });

  if ('IntersectionObserver' in window && !reducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting && playing) { if (!timer) start(); } else if (timer) { clearInterval(timer); timer = null; } });
    }, { threshold: 0.2 });
    io.observe(root);
  }

  paint(0);
  drawMoves(0, true);
  if (playing) start();
  return { show, stop, start };
}
