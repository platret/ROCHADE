/* Read access to the shared Supabase project (Alex's database, the same one the phone app uses).
   PostgREST is called with the publishable key in the apikey header only: with an Authorization header it
   would try to verify the key as a JWT and answer 401. The key lives in js/env.js (gitignored) and is imported
   lazily, so the site keeps running from the demo data when the file is missing. */

const REST = '/rest/v1/';
const WRITTEN_BY_APP = new Set(['assignments']); // the app's planner owns these rows, the website only reads them
const defaultFetch = (...args) => globalThis.fetch(...args);

let envPromise = null;
const loadEnv = () => (envPromise ??= import('./env.js').catch(() => null));
const isFilled = (v) => typeof v === 'string' && v.trim() !== '';
const hasConfig = (env) => Boolean(env && isFilled(env.SUPABASE_URL) && isFilled(env.SUPABASE_KEY));

export async function isConfigured() { return hasConfig(await loadEnv()); }

export const normaliseCode = (code) => String(code ?? '').trim().toUpperCase();

const tableOf = (path) => String(path).replace(/^\/+/, '').split(/[?/]/)[0];

/* Guard rails from the handoff: nothing is deleted, assignments and Etappen dates are changed in the app only. */
function assertAllowed(method, table) {
  if (method === 'DELETE') throw new Error('Löschen ist auf der Website nicht vorgesehen.');
  if (method !== 'GET' && WRITTEN_BY_APP.has(table)) throw new Error(`Die Tabelle «${table}» wird nur von der App geschrieben.`);
  if ((method === 'PATCH' || method === 'PUT') && table === 'phases') throw new Error('Etappen werden nur in der App verschoben.');
}

async function describeError(res) {
  const base = `Die Datenbank antwortet mit Fehler ${res.status}${res.statusText ? ` (${res.statusText})` : ''}.`;
  try {
    const data = await res.json();
    const detail = data && (data.message || data.hint || data.error);
    return detail ? `${base} ${detail}` : base;
  } catch {
    return base;
  }
}

/** Low-level PostgREST call. `path` is relative to /rest/v1/, e.g. 'flats?select=*&project_id=eq.…'.
    `fetchImpl` and `env` exist for tests and scripts; in the browser the defaults apply. */
export async function request(path, { method = 'GET', body, prefer, fetchImpl = defaultFetch, env } = {}) {
  const cfg = env ?? await loadEnv();
  if (!hasConfig(cfg)) throw new Error('Keine Verbindung zur Datenbank: js/env.js fehlt oder ist leer.');
  const verb = String(method).toUpperCase();
  assertAllowed(verb, tableOf(path));
  const headers = {
    apikey: cfg.SUPABASE_KEY,
    Accept: 'application/json',
    ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    ...(prefer ? { Prefer: prefer } : {}),
  };
  const url = `${cfg.SUPABASE_URL.replace(/\/+$/, '')}${REST}${String(path).replace(/^\/+/, '')}`;
  let res;
  try {
    res = await fetchImpl(url, { method: verb, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch (err) {
    throw new Error(`Keine Verbindung zur Datenbank (${err && err.message ? err.message : 'Netzwerkfehler'}).`);
  }
  if (!res.ok) throw new Error(await describeError(res));
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

/** The project behind a Verwaltungscode, or null. Codes are compared trimmed and in upper case. */
export async function findProjectByAdminCode(code, options = {}) {
  const clean = normaliseCode(code);
  if (!clean) return null;
  const rows = await request(`projects?select=id,name,city,admin_code&admin_code=eq.${encodeURIComponent(clean)}&limit=1`, options);
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

/** The five tables of one project, loaded in parallel. Phases come ordered by sort_order, then start_date. */
export async function loadProjectData(projectId, options = {}) {
  const id = encodeURIComponent(String(projectId ?? '').trim());
  if (!id) throw new Error('Kein Projekt angegeben.');
  const ofProject = (table, order) => request(`${table}?select=*&project_id=eq.${id}&order=${order}`, options);
  const [projects, phases, flats, households, assignments] = await Promise.all([
    request(`projects?select=*&id=eq.${id}&limit=1`, options),
    ofProject('phases', 'sort_order.asc,start_date.asc'),
    ofProject('flats', 'created_at.asc,label.asc'),
    ofProject('households', 'created_at.asc,name.asc'),
    ofProject('assignments', 'updated_at.asc'),
  ]);
  const project = Array.isArray(projects) ? projects[0] : null;
  if (!project) throw new Error('Dieses Projekt gibt es in der Datenbank nicht.');
  return { project, phases: phases || [], flats: flats || [], households: households || [], assignments: assignments || [] };
}
