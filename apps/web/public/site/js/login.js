/* Login page: the Verwaltung enters the six-character admin code; we look the project up and store a session.
   The Supabase module is imported dynamically so the page still renders (with a notice) without it. */
import { injectIcons } from './icons.js';
import { initMenu } from './chrome.js';
import { getSession, setSession, clearSession } from './session.js';
import { esc } from './views/format.js';

const CODE_LENGTH = 6;
const DEMO_CODE = 'V7Q3KD';
const MSG = {
  length: 'Bitte geben Sie die sechs Zeichen des Codes ein.',
  invalid: 'Dieser Code ist nicht gültig. Prüfen Sie die sechs Zeichen.',
  offline: 'Die Datenbank ist gerade nicht erreichbar. Bitte nochmals versuchen.',
};

const els = {
  form: document.getElementById('login-form'),
  input: document.getElementById('code'),
  submit: document.getElementById('login-submit'),
  msg: document.getElementById('code-msg'),
  notice: document.getElementById('login-notice'),
  current: document.getElementById('login-current'),
};
let api = null;

const normalise = (value) => String(value ?? '').replace(/\s+/g, '').toUpperCase();

function showMessage(text) {
  els.msg.textContent = text;
  els.msg.hidden = !text;
}

function setBusy(busy) {
  els.submit.disabled = busy;
  els.submit.textContent = busy ? 'Prüfe …' : 'Anmelden';
  els.form.setAttribute('aria-busy', String(busy));
}

function renderCurrent(session) {
  els.current.hidden = !session;
  els.current.innerHTML = session
    ? `<span>Bereits angemeldet: <b>${esc(session.name)}</b>${session.city ? `, ${esc(session.city)}` : ''}.</span>
       <a class="btn btn-sm btn-primary" href="app.html">Planung öffnen</a>
       <button type="button" class="btn btn-sm btn-ghost" data-action="logout">Abmelden</button>`
    : '';
}

async function submit(e) {
  e.preventDefault();
  const code = normalise(els.input.value);
  if (code.length !== CODE_LENGTH) { showMessage(MSG.length); els.input.focus(); return; }
  if (!api) { showMessage(MSG.offline); return; }
  showMessage('');
  setBusy(true);
  try {
    const row = await api.findProjectByAdminCode(code);
    if (!row) { showMessage(MSG.invalid); els.input.select(); return; }
    setSession({ projectId: row.id, name: row.name, city: row.city, adminCode: row.admin_code });
    location.href = 'app.html';
  } catch (err) {
    console.warn('Anmeldung fehlgeschlagen', err);
    showMessage(MSG.offline);
  } finally {
    setBusy(false);
  }
}

async function init() {
  injectIcons();
  initMenu();
  renderCurrent(getSession());

  api = await import('./supabase.js').catch((err) => { console.warn('Supabase-Modul nicht geladen', err); return null; });
  const configured = api ? await api.isConfigured().catch(() => false) : false;
  if (!configured) {
    els.form.hidden = true;
    els.notice.hidden = false;
    return;
  }
  els.form.addEventListener('submit', submit);
  els.input.addEventListener('input', () => {
    const clean = els.input.value.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, CODE_LENGTH);
    if (clean !== els.input.value) els.input.value = clean;
    if (!els.msg.hidden) showMessage('');
  });
  els.input.focus();
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  if (btn.dataset.action === 'fill-demo') { els.input.value = DEMO_CODE; showMessage(''); els.input.focus(); }
  if (btn.dataset.action === 'logout') { clearSession(); renderCurrent(null); }
});

init();
