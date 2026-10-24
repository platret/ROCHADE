import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { toProject, monthIndexOf } from '../js/remote.js';
import { planRochade, validateProject, monthLabel } from '../js/planner.js';
import { request, findProjectByAdminCode, loadProjectData, isConfigured, normaliseCode } from '../js/supabase.js';
import { renderTimeline } from '../js/views/timeline.js';
import { renderTable } from '../js/views/table.js';
import { renderInput } from '../js/views/input.js';
import { renderMoves } from '../js/views/buildings.js';
import { apartmentLabel, flatLabelOf } from '../js/views/format.js';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/sonnenhalde.json', import.meta.url)));
const rows = (patch = {}) => ({ project: fixture.projects[0], phases: fixture.phases, flats: fixture.flats, households: fixture.households, assignments: fixture.assignments, ...patch });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const CODE = /^[A-HJ-KM-NP-Z2-9]{6}$/;
const PROJECT_ID = 'a0000000-0000-4000-8000-000000000001';

/* Placeholder configuration for the injected fetch: no network, no real key. */
const ENV = { SUPABASE_URL: 'https://example.invalid/', SUPABASE_KEY: 'test-key' };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const recorder = (reply) => {
  const calls = [];
  const fetchImpl = async (url, init) => { calls.push({ url: new URL(url), init }); return reply(new URL(url), init, calls.length); };
  return { calls, fetchImpl };
};

test('Sonnenhalde maps to five buildings: A to C renovated with fixed Etappen, D and E only as Ausweichfläche', () => {
  const p = toProject(rows());
  assert.deepEqual(p.buildings.map((b) => b.id), ['B1', 'B2', 'B3', 'B4', 'B5']);
  assert.deepEqual(p.buildings.map((b) => b.name), ['Haus A', 'Haus B', 'Haus C', 'Haus D', 'Haus E']);
  assert.deepEqual(p.buildings.map((b) => b.renovate), [true, true, true, false, false]);
  assert.deepEqual(p.buildings.map((b) => b.fixedPhase ?? null), [
    { start: 0, duration: 3, name: 'Etappe 1' }, { start: 3, duration: 4, name: 'Etappe 2' }, { start: 6, duration: 3, name: 'Etappe 3' }, null, null,
  ]);
  assert.ok(p.buildings.every((b) => b.lift === false && b.street === ''));
  assert.deepEqual(p.timeline, { startYear: 2027, startMonth: 3, months: 12 });
  assert.deepEqual(p.phases.map((x) => [x.id, x.building, x.start, x.duration, x.name, x.fixed]), [
    ['P1', 'B1', 0, 3, 'Etappe 1', true], ['P2', 'B2', 3, 4, 'Etappe 2', true], ['P3', 'B3', 6, 3, 'Etappe 3', true],
  ]);
  assert.equal(monthLabel(p, 0), 'März 2027');
});

test('apartments keep the uuid as id and carry the printed label without the Whg. prefix', () => {
  const p = toProject(rows());
  assert.equal(p.apartments.length, 16);
  assert.ok(p.apartments.every((a) => UUID.test(a.id)));
  assert.ok(p.apartments.every((a) => /^[A-E]\.\d\d$/.test(a.label)));
  const a01 = p.apartments.find((a) => a.label === 'A.01');
  assert.deepEqual(a01, { id: 'c0000000-0000-4000-8000-000000000001', label: 'A.01', building: 'B1', floor: 0, rooms: 2.5, stepFree: true, temporary: false, schoolDistrict: 'Waidberg' });
  assert.equal(p.apartments.filter((a) => a.temporary).length, 5);
  assert.equal(p.apartments.find((a) => a.label === 'D.11').building, 'B4');
  assert.deepEqual(p.external, []);
});

test('households carry invite code and the app status; Herr Brunner is the conflict the app found', () => {
  const p = toProject(rows());
  assert.equal(p.households.length, 11);
  assert.ok(p.households.every((h) => UUID.test(h.id) && CODE.test(h.inviteCode)));
  assert.equal(new Set(p.households.map((h) => h.inviteCode)).size, 11);
  assert.ok(p.households.every((h) => h.inviteCode !== 'V7Q3KD'));
  const brunner = p.households.find((h) => h.name === 'Herr Brunner');
  assert.equal(brunner.short, 'Brunner');
  assert.equal(brunner.apartment, 'c0000000-0000-4000-8000-000000000009');
  assert.equal(brunner.roomsMin, 2);
  assert.equal(brunner.stepFree, true);
  assert.equal(brunner.appStatus, 'conflict');
  assert.match(brunner.appReason, /hindernisfreie 2-Zimmer-Wohnung/);
  assert.equal(p.households.filter((h) => h.appStatus === 'ok').length, 10);
  const aeschbacher = p.households.find((h) => h.name === 'Herr und Frau Aeschbacher');
  assert.equal(aeschbacher.short, 'Aeschbacher');
  assert.equal(aeschbacher.persons, 2);
  assert.equal(aeschbacher.appReason, null);
  assert.equal(p.households.find((h) => h.name === 'Frau Schmid').note, '');
  assert.deepEqual(p.households.slice(0, 2).map((h) => h.name), ['Frau Schmid', 'Herr Zimmermann']); // in the order of their flats
});

test('the mapped project validates, plans without throwing and remembers where it came from', () => {
  const input = rows();
  const p = toProject(input);
  assert.deepEqual(validateProject(p), []);
  const plan = planRochade(p);
  assert.equal(plan.stats.households, 11);
  assert.equal(plan.assignments.length, 11);
  assert.equal(p.name, 'Siedlung Sonnenhalde');
  assert.equal(p.owner, 'Siedlung Sonnenhalde (Verwaltung)');
  assert.equal(p.remote.id, PROJECT_ID);
  assert.equal(p.remote.city, 'Zürich');
  assert.equal(p.remote.adminCode, 'V7Q3KD');
  assert.deepEqual(p.remote.skipped, []);
  assert.equal(typeof p.remote.loadedAt, 'number');
  assert.deepEqual(input, rows()); // inputs untouched
});

test('a household without a known home flat is skipped and listed, the rest keeps planning', () => {
  const [first, second, ...others] = fixture.households;
  const households = [{ ...first, home_flat_id: null }, { ...second, home_flat_id: 'c0000000-0000-4000-8000-000000000099' }, ...others];
  const frozen = households.map((h) => Object.freeze(h));
  const p = toProject(rows({ households: Object.freeze(frozen) }));
  assert.equal(p.households.length, 9);
  assert.deepEqual(p.remote.skipped, ['Familie Keller', 'Frau Schmid']);
  assert.deepEqual(validateProject(p), []);
  assert.equal(planRochade(p).stats.households, 9);
});

test('flats in a building called Extern… become external Rochade-Wohnungen instead of a building', () => {
  const extra = { ...fixture.flats[0], id: 'c0000000-0000-4000-8000-000000000077', label: 'Rotbuchstrasse 12, 2. OG', building: 'Externe Wohnungen', floor: 2, rooms: 3.5, step_free: true, is_temporary: true };
  const p = toProject(rows({ flats: [...fixture.flats, extra] }));
  assert.equal(p.buildings.length, 5);
  assert.equal(p.apartments.length, 16);
  assert.deepEqual(p.external, [{ id: extra.id, name: 'Rotbuchstrasse 12, 2. OG', rooms: 3.5, stepFree: true, availableFrom: 0, availableTo: Number.POSITIVE_INFINITY }]);
  assert.deepEqual(validateProject(p), []);
});

test('without Etappen nothing is renovated and the timeline starts in the current month', () => {
  const p = toProject(rows({ phases: [] }));
  const now = new Date();
  assert.deepEqual(p.timeline, { startYear: now.getFullYear(), startMonth: now.getMonth() + 1, months: 12 });
  assert.deepEqual(p.phases, []);
  assert.ok(p.buildings.every((b) => b.renovate === false && !b.fixedPhase));
  assert.deepEqual(p.buildings.map((b) => b.name), ['Haus A', 'Haus B', 'Haus C', 'Haus D', 'Haus E']);
});

test('the views print the flat labels of a database project, never its uuids', () => {
  const p = toProject(rows());
  const plan = planRochade(p);
  const a01 = 'c0000000-0000-4000-8000-000000000001';
  assert.equal(apartmentLabel(p, a01), 'A.01');
  assert.equal(flatLabelOf(p, a01), 'Whg. A.01');
  assert.equal(apartmentLabel(p, 'unbekannt'), 'unbekannt');
  assert.ok(plan.assignments.filter((a) => a.flatId).every((a) => /^Whg\. [DE]\.\d\d$/.test(a.flatLabel)));

  const visibleText = (html) => html.replace(/<[^>]+>/g, ' '); // ids stay in data attributes, labels in the text
  const anyUuid = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
  const moveMonths = [...new Set(plan.assignments.filter((a) => a.flatId).map((a) => a.from))];
  const pages = {
    timeline: renderTimeline(p, plan),
    table: renderTable(p, plan),
    input: renderInput(p),
    moves: moveMonths.map((m) => renderMoves(p, plan, m)).join(''),
  };
  for (const [name, html] of Object.entries(pages)) assert.doesNotMatch(visibleText(html), anyUuid, name);
  assert.ok(!pages.timeline.includes('Rochade-Wohnung c0'), 'bar titles carry the label');
  assert.match(visibleText(pages.timeline), /Frau Schmid\s+Whg\. A\.01 · 1 P\./);
  assert.match(visibleText(pages.table), /Whg\. [DE]\.\d\d/);
  assert.match(visibleText(pages.input), /D\.11 · 4,5 Zi\./); // the «Wohnt in» options name the vacant flats
  assert.match(visibleText(pages.moves), /→ Whg\. [DE]\.\d\d/);
});

test('month index counts whole months from the timeline start', () => {
  const timeline = { startYear: 2027, startMonth: 3 };
  assert.equal(monthIndexOf(timeline, '2027-03-01'), 0);
  assert.equal(monthIndexOf(timeline, '2027-06-01'), 3);
  assert.equal(monthIndexOf(timeline, '2027-09-12'), 6);
  assert.equal(monthIndexOf(timeline, '2028-01-31'), 10);
  assert.equal(monthIndexOf(timeline, '2026-12-15'), -3);
  assert.equal(monthIndexOf(timeline, null), null);
});

test('findProjectByAdminCode trims and upper-cases the code and sends the apikey header only', async () => {
  const { calls, fetchImpl } = recorder(() => json([fixture.projects[0]]));
  const found = await findProjectByAdminCode(' v7q3kd ', { fetchImpl, env: ENV });
  assert.equal(calls.length, 1);
  const { url, init } = calls[0];
  assert.equal(url.origin + url.pathname, 'https://example.invalid/rest/v1/projects');
  assert.equal(url.searchParams.get('admin_code'), 'eq.V7Q3KD');
  assert.equal(url.searchParams.get('select'), 'id,name,city,admin_code');
  assert.equal(init.method, 'GET');
  assert.equal(init.headers.apikey, 'test-key');
  assert.equal(init.headers.Accept, 'application/json');
  assert.ok(!Object.keys(init.headers).some((k) => k.toLowerCase() === 'authorization'));
  assert.equal(init.body, undefined);
  assert.deepEqual(found, fixture.projects[0]);
  assert.equal(await findProjectByAdminCode('   ', { fetchImpl, env: ENV }), null);
  assert.equal(calls.length, 1); // an empty code never reaches the database
  const none = recorder(() => json([]));
  assert.equal(await findProjectByAdminCode('ZZZZZZ', { fetchImpl: none.fetchImpl, env: ENV }), null);
});

test('loadProjectData fetches the five tables of one project at once, phases ordered by sort_order', async () => {
  const reply = (url) => {
    const table = url.pathname.split('/').pop();
    return json(table === 'projects' ? fixture.projects : fixture[table]);
  };
  const { calls, fetchImpl } = recorder(reply);
  const pending = loadProjectData(PROJECT_ID, { fetchImpl, env: ENV });
  assert.equal(calls.length, 5); // all five requests leave before the first answer arrives
  const data = await pending;
  assert.deepEqual(Object.keys(data), ['project', 'phases', 'flats', 'households', 'assignments']);
  assert.equal(data.project.admin_code, 'V7Q3KD');
  assert.equal(data.flats.length, 16);
  const byTable = Object.fromEntries(calls.map((c) => [c.url.pathname.split('/').pop(), c.url.searchParams]));
  assert.equal(byTable.projects.get('id'), `eq.${PROJECT_ID}`);
  for (const table of ['phases', 'flats', 'households', 'assignments']) assert.equal(byTable[table].get('project_id'), `eq.${PROJECT_ID}`);
  assert.equal(byTable.phases.get('order'), 'sort_order.asc,start_date.asc');
  await assert.rejects(loadProjectData(PROJECT_ID, { fetchImpl: recorder(() => json([])).fetchImpl, env: ENV }), /nicht/);
  await assert.rejects(loadProjectData('', { fetchImpl, env: ENV }), /Kein Projekt/);
});

test('request keeps the handoff rules: no deletes, no writes to assignments, no shifting of phases', async () => {
  const { calls, fetchImpl } = recorder(() => json([]));
  await assert.rejects(request('assignments', { method: 'POST', body: { status: 'ok' }, fetchImpl, env: ENV }), /nur von der App/);
  await assert.rejects(request('assignments?household_id=eq.x', { method: 'PATCH', body: {}, fetchImpl, env: ENV }), /nur von der App/);
  await assert.rejects(request('flats?id=eq.x', { method: 'DELETE', fetchImpl, env: ENV }), /Löschen/);
  await assert.rejects(request('phases?id=eq.x', { method: 'PATCH', body: { start_date: '2027-04-01' }, fetchImpl, env: ENV }), /nur in der App/);
  assert.equal(calls.length, 0);
  await request('flats', { method: 'POST', body: [{ label: 'Whg. A.01' }], prefer: 'return=representation', fetchImpl, env: ENV });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].init.headers['Content-Type'], 'application/json');
  assert.equal(calls[0].init.headers.Prefer, 'return=representation');
  assert.equal(calls[0].init.body, JSON.stringify([{ label: 'Whg. A.01' }]));
});

test('request explains database and network errors in German and works without a configuration only by failing clearly', async () => {
  const denied = recorder(() => json({ message: 'permission denied for table flats' }, 401));
  await assert.rejects(request('flats', { fetchImpl: denied.fetchImpl, env: ENV }), /Fehler 401.*permission denied/);
  const offline = recorder(() => { throw new TypeError('fetch failed'); });
  await assert.rejects(request('flats', { fetchImpl: offline.fetchImpl, env: ENV }), /Keine Verbindung.*fetch failed/);
  const { calls, fetchImpl } = recorder(() => json([]));
  await assert.rejects(request('flats', { fetchImpl, env: { SUPABASE_URL: '', SUPABASE_KEY: '' } }), /env\.js/);
  assert.equal(calls.length, 0);
  const empty = recorder(() => new Response(null, { status: 204 }));
  assert.equal(await request('flats', { method: 'POST', body: {}, fetchImpl: empty.fetchImpl, env: ENV }), null);
  assert.equal(typeof await isConfigured(), 'boolean');
  assert.equal(normaliseCode(' v7q3kd '), 'V7Q3KD');
  assert.equal(normaliseCode(null), '');
});
