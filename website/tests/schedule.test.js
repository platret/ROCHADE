import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PROJECT } from '../js/data.js';
import { planRochade, validateProject } from '../js/planner.js';
import { scheduleProject, scheduleSummary, phaseDuration, rebaseStarts, BUFFER_MONTHS, RESERVE_MONTHS } from '../js/schedule.js';
import { addBuilding, moveBuilding, setRenovate, removeBuilding, addHousehold, vacantApartments } from '../js/edit.js';
import { toProject } from '../js/remote.js';

const sonnenhalde = JSON.parse(readFileSync(new URL('./fixtures/sonnenhalde.json', import.meta.url)));
const remoteProject = () => toProject({ project: sonnenhalde.projects[0], phases: sonnenhalde.phases, flats: sonnenhalde.flats, households: sonnenhalde.households, assignments: sonnenhalde.assignments });

test('phase duration: three months base plus one month per six apartments', () => {
  assert.equal(phaseDuration(11), 5);
  assert.equal(phaseDuration(6), 4);
  assert.equal(phaseDuration(12), 5);
  assert.equal(phaseDuration(13), 6);
});

test('the demo schedule comes out of the scheduler: 0/5, 6/5, 12/5 on twenty months, no conflicts', () => {
  assert.deepEqual(PROJECT.phases.map((p) => [p.id, p.building, p.start, p.duration]), [['P1', 'A', 0, 5], ['P2', 'B', 6, 5], ['P3', 'C', 12, 5]]);
  assert.equal(PROJECT.timeline.months, 20);
  assert.deepEqual(scheduleProject(PROJECT).phases, PROJECT.phases);
  assert.equal(planRochade(PROJECT).conflicts.length, 0);
});

test('a new building becomes the next Etappe and the timeline grows with it', () => {
  const next = scheduleProject(addBuilding(PROJECT, { name: 'Haus D', floors: 3, perFloor: 3 }));
  assert.equal(next.phases.length, 4);
  const p4 = next.phases[3];
  assert.equal(p4.id, 'P4');
  assert.equal(p4.building, 'D');
  assert.equal(p4.start, 17 + BUFFER_MONTHS);
  assert.equal(p4.duration, phaseDuration(9));
  assert.equal(next.timeline.months, p4.start + p4.duration + RESERVE_MONTHS);
  assert.deepEqual(validateProject(next), []);
  assert.equal(planRochade(next).conflicts.length, 0);
});

test('a building without Sanierung gets no Etappe and only serves as Ausweichfläche', () => {
  const withD = addBuilding(PROJECT, { name: 'Haus D' });
  const next = scheduleProject(setRenovate(withD, 'D', false));
  assert.equal(next.phases.length, 3);
  assert.equal(next.timeline.months, 20);
  assert.equal(scheduleProject(setRenovate(next, 'D', true)).phases.length, 4);
});

test('moving a building changes the Etappen order, ids stay positional', () => {
  const next = scheduleProject(moveBuilding(PROJECT, 'C', -2));
  assert.deepEqual(next.phases.map((p) => p.building), ['C', 'A', 'B']);
  assert.deepEqual(next.phases.map((p) => p.id), ['P1', 'P2', 'P3']);
  assert.equal(moveBuilding(PROJECT, 'A', -1), PROJECT);
  assert.equal(moveBuilding(PROJECT, 'C', 1), PROJECT);
});

test('manual shifts survive a re-plan; new phases start at their automatic month', () => {
  const next = scheduleProject(addBuilding(PROJECT, { name: 'Haus D' }));
  assert.deepEqual(rebaseStarts(PROJECT, { P1: 2, P2: 6, P3: 12 }, next), { P1: 2, P2: 6, P3: 12, P4: next.phases[3].start });
  const reordered = scheduleProject(moveBuilding(PROJECT, 'C', -2));
  assert.deepEqual(rebaseStarts(PROJECT, { P1: 2, P2: 6, P3: 12 }, reordered), { P1: 0, P2: 8, P3: 12 });
});

test('a building with households cannot be removed, an empty one can', () => {
  assert.equal(removeBuilding(PROJECT, 'A'), PROJECT);
  const withD = addBuilding(PROJECT, { name: 'Haus D' });
  assert.equal(removeBuilding(withD, 'D').buildings.length, 3);
  const apt = vacantApartments(withD).find((a) => a.building === 'D');
  const lived = addHousehold(withD, { name: 'Fam. Test', apartment: apt.id });
  assert.equal(removeBuilding(lived, 'D'), lived);
});

test('Etappen from the database are fixed: Sonnenhalde comes out as 0/3, 3/4, 6/3 on twelve months from March 2027', () => {
  const p = remoteProject();
  assert.deepEqual(p.phases.map((x) => [x.id, x.building, x.start, x.duration, x.name]), [['P1', 'B1', 0, 3, 'Etappe 1'], ['P2', 'B2', 3, 4, 'Etappe 2'], ['P3', 'B3', 6, 3, 'Etappe 3']]);
  assert.ok(p.phases.every((x) => x.fixed === true));
  assert.deepEqual(p.timeline, { startYear: 2027, startMonth: 3, months: 9 + RESERVE_MONTHS });
  assert.deepEqual(scheduleProject(p).phases, p.phases);
  assert.deepEqual(validateProject(p), []);
  assert.match(scheduleSummary(p), /^3 Etappen mit den Terminen aus der Datenbank übernommen, 9 Monate Bauzeit\./);
});

test('a building without fixed dates chains after the last fixed Etappe plus the buffer month', () => {
  const p = remoteProject();
  const next = scheduleProject(addBuilding(p, { name: 'Haus F', floors: 3, perFloor: 3 }));
  const p4 = next.phases[3];
  assert.equal(p4.id, 'P4');
  assert.equal(p4.start, 9 + BUFFER_MONTHS);
  assert.equal(p4.duration, phaseDuration(9));
  assert.equal(p4.fixed, undefined);
  assert.equal(next.timeline.months, p4.start + p4.duration + RESERVE_MONTHS);
  assert.deepEqual(next.phases.slice(0, 3), p.phases);
  // Haus D is an Ausweichhaus in the database; marked for renovation it also chains after the fixed Etappen
  const withD = scheduleProject(setRenovate(p, 'B4', true));
  assert.deepEqual(withD.phases.map((x) => [x.id, x.building, x.start, x.duration]), [['P1', 'B1', 0, 3], ['P2', 'B2', 3, 4], ['P3', 'B3', 6, 3], ['P4', 'B4', 10, phaseDuration(3)]]);
  assert.match(scheduleSummary(withD), /^3 von 4 Etappen mit festen Terminen/);
  assert.deepEqual(validateProject(withD), []);
});
