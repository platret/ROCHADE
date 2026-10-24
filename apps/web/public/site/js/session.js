/* Login session of the Verwaltung: which project was opened with which admin code. Lives in sessionStorage,
   so it ends with the tab; storage can be blocked (private mode, iframes), hence every access is guarded. */
const KEY = 'rochade.session';

const storage = () => globalThis.sessionStorage;

export function getSession() {
  try {
    const raw = storage().getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || typeof s.projectId !== 'string' || !s.projectId) return null;
    return Object.freeze({ projectId: s.projectId, name: String(s.name ?? ''), city: String(s.city ?? ''), adminCode: String(s.adminCode ?? '') });
  } catch (err) {
    console.warn('Session nicht lesbar', err);
    return null;
  }
}

export function setSession({ projectId, name = '', city = '', adminCode = '' }) {
  if (!projectId) throw new Error('Session ohne projectId');
  const session = { projectId: String(projectId), name: String(name), city: String(city), adminCode: String(adminCode).trim().toUpperCase() };
  try {
    storage().setItem(KEY, JSON.stringify(session));
    return true;
  } catch (err) {
    console.warn('Session nicht gespeichert', err);
    return false;
  }
}

export function clearSession() {
  try {
    storage().removeItem(KEY);
  } catch (err) {
    console.warn('Session nicht gelöscht', err);
  }
}
