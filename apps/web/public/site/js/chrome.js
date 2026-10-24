/* Shared page chrome: the header menu sheet (mobile) with aria state, Escape and focus return. */
export function initMenu() {
  const header = document.getElementById('site-header');
  const btn = header && header.querySelector('.menu-btn');
  if (!btn) return;
  const setOpen = (open) => {
    header.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Menü schliessen' : 'Menü öffnen');
    if (!open && document.activeElement && header.contains(document.activeElement) && document.activeElement !== btn) btn.focus();
  };
  btn.addEventListener('click', () => setOpen(!header.classList.contains('is-open')));
  header.querySelectorAll('.nav a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}

export const CHEVRON_LEFT = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
export const CHEVRON_RIGHT = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
