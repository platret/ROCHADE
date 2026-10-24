/* Inline icon sprite (Lucide-derived paths, 2px stroke, currentColor). Injected once per page. */
const ICONS = {
  'i-alert': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  'i-check': '<path d="M20 6 9 17l-5-5"/>',
  'i-check-circle': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  'i-swap': '<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
  'i-move': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'i-return': '<path d="M9 14 4 9l5-5"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>',
  'i-minus': '<path d="M5 12h14"/>',
  'i-plus': '<path d="M5 12h14"/><path d="M12 5v14"/>',
  'i-play': '<polygon points="6 3 20 12 6 21 6 3"/>',
  'i-pause': '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
  'i-users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'i-building': '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
  'i-calendar': '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  'i-arrow': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'i-arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  'i-accessibility': '<circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/>',
  'i-info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
};

/* The ROCHADE mark: two mirrored rows of hollow cell, bar, filled cell. Out above, back below. */
export const MARK_SYMBOL = '<symbol id="mark" viewBox="0 0 64 64" fill="currentColor"><path fill-rule="evenodd" d="M4 4h24v24H4zM12 12v8h8v-8z"/><rect x="28" y="12" width="8" height="8"/><rect x="36" y="4" width="24" height="24"/><rect x="4" y="36" width="24" height="24"/><rect x="28" y="44" width="8" height="8"/><path fill-rule="evenodd" d="M36 36h24v24H36zM44 44v8h8v-8z"/></symbol>';

export function injectIcons(extraSymbols = '') {
  if (document.getElementById('icon-sprite')) return;
  const symbols = Object.entries(ICONS).map(([id, body]) =>
    `<symbol id="${id}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</symbol>`).join('');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'icon-sprite';
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.position = 'absolute';
  svg.innerHTML = symbols + MARK_SYMBOL + extraSymbols;
  document.body.prepend(svg);
}
