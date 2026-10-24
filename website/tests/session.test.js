import test from 'node:test';
import assert from 'node:assert/strict';
import { getSession, setSession, clearSession } from '../js/session.js';
import { PROJECT } from '../js/data.js';
import { planRochade } from '../js/planner.js';
import { renderTable } from '../js/views/table.js';
import { renderInput } from '../js/views/input.js';

/* sessionStorage does not exist in Node; a Map-backed stub stands in, optionally throwing like a blocked store. */
function stubStorage({ broken = false } = {}) {
  const store = new Map();
  const guard = () => { if (broken) throw new Error('blocked'); };
  globalThis.sessionStorage = {
    getItem: (k) => { guard(); return store.has(k) ? store.get(k) : null; },
    setItem: (k, v) => { guard(); store.set(k, String(v)); },
    removeItem: (k) => { guard(); store.delete(k); },
  };
  return store;
}
const quiet = (fn) => { const warn = console.warn; console.warn = () => {}; try { return fn(); } finally { console.warn = warn; } };

test('setSession stores a normalised session that getSession reads back and clearSession removes', () => {
  const store = stubStorage();
  assert.equal(getSession(), null);
  assert.equal(setSession({ projectId: 'a0000000-0000-4000-8000-000000000001', name: 'Siedlung Sonnenhalde', city: 'Zürich', adminCode: ' v7q3kd ' }), true);
  assert.deepEqual(getSession(), { projectId: 'a0000000-0000-4000-8000-000000000001', name: 'Siedlung Sonnenhalde', city: 'Zürich', adminCode: 'V7Q3KD' });
  assert.equal(store.size, 1);
  clearSession();
  assert.equal(getSession(), null);
});

test('getSession ignores garbage and a blocked storage without throwing', () => {
  const store = stubStorage();
  store.set('rochade.session', '{not json');
  assert.equal(quiet(() => getSession()), null);
  store.set('rochade.session', JSON.stringify({ name: 'ohne projectId' }));
  assert.equal(getSession(), null);
  stubStorage({ broken: true });
  assert.equal(quiet(() => getSession()), null);
  assert.equal(quiet(() => setSession({ projectId: 'x' })), false);
  assert.doesNotThrow(() => quiet(() => clearSession()));
});

test('setSession refuses a session without projectId', () => {
  stubStorage();
  assert.throws(() => setSession({ name: 'nur Name' }), /projectId/);
});

const remoteProject = () => ({
  ...PROJECT,
  remote: { id: 'p1', name: 'Siedlung Sonnenhalde', city: 'Zürich', adminCode: 'V7Q3KD', loadedAt: 0 },
  households: PROJECT.households.map((h, i) => ({
    ...h, inviteCode: `C${String(i).padStart(5, '0')}`, schoolDistrict: i === 0 ? 'Waidberg' : null, appStatus: i === 0 ? 'conflict' : i === 1 ? 'open' : 'ok', appReason: i === 0 ? 'Fehlt <Wohnung>' : null,
  })),
});

test('Haushalte view shows invite codes, wishes and the app status only for database projects', () => {
  const demo = renderTable(PROJECT, planRochade(PROJECT));
  assert.equal(demo.includes('Zugangscode'), false);
  assert.equal(demo.includes('App:'), false);

  const project = remoteProject();
  const html = renderTable(project, planRochade(project));
  assert.ok(html.includes('<th scope="col">Zugangscode</th>'));
  assert.ok(html.includes('<th scope="col">Wünsche</th>'));
  assert.ok(html.includes('data-copy="C00000"'));
  assert.ok(html.includes('Schulkreis Waidberg'));
  assert.ok(html.includes('badge-danger') && html.includes('App: Konflikt'));
  assert.ok(html.includes('App: Offen') && html.includes('App: Zugeteilt'));
  assert.ok(html.includes('Fehlt &lt;Wohnung&gt;'), 'database strings are escaped');
});

test('Erfassen view shows invite codes and the local-only note for database projects', () => {
  assert.equal(renderInput(PROJECT).includes('noch nicht in die Datenbank'), false);
  const html = renderInput(remoteProject());
  assert.ok(html.includes('noch nicht in die Datenbank geschrieben'));
  assert.ok(html.includes('C00023'));
});
