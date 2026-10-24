import test from 'node:test';
import assert from 'node:assert/strict';
import { PROJECT } from '../js/data.js';
import { planRochade, validateProject } from '../js/planner.js';
import { addBuilding, removeBuilding, setLift, addHousehold, removeHousehold, addExternal, removeExternal, vacantApartments } from '../js/edit.js';

test('addBuilding creates vacant apartments with step-free ground floor and leaves the input untouched', () => {
  const next = addBuilding(PROJECT, { name: 'Haus D', floors: 2, perFloor: 3, rooms: 'mixed', lift: false });
  assert.equal(PROJECT.buildings.length, 3);
  assert.equal(next.buildings.length, 4);
  assert.equal(next.buildings[3].id, 'D');
  const apts = next.apartments.filter((a) => a.building === 'D');
  assert.equal(apts.length, 6);
  assert.deepEqual(apts.map((a) => a.stepFree), [true, true, true, false, false, false]);
  assert.deepEqual(apts.slice(0, 3).map((a) => a.rooms), [2.5, 3.5, 4.5]);
  assert.equal(validateProject(next).length, 0);
});

test('a building with a phase cannot be removed, an added one can', () => {
  assert.equal(removeBuilding(PROJECT, 'A'), PROJECT);
  const withD = addBuilding(PROJECT, { name: 'Haus D' });
  const back = removeBuilding(withD, 'D');
  assert.equal(back.buildings.length, 3);
  assert.equal(back.apartments.length, PROJECT.apartments.length);
});

test('setLift makes all floors step-free and back', () => {
  const lifted = setLift(PROJECT, 'A', true);
  assert.ok(lifted.apartments.filter((a) => a.building === 'A').every((a) => a.stepFree));
  const unlifted = setLift(lifted, 'A', false);
  assert.ok(unlifted.apartments.filter((a) => a.building === 'A' && a.floor > 0).every((a) => !a.stepFree));
});

test('addHousehold only into an existing vacant apartment, then the planner assigns it', () => {
  const vacant = vacantApartments(PROJECT);
  assert.equal(vacant.length, 9);
  const target = vacant.find((a) => a.building === 'A');
  const next = addHousehold(PROJECT, { name: 'Fam. Bernasconi', apartment: target.id, persons: 3, roomsMin: 3.5 });
  assert.equal(next.households.length, 25);
  assert.equal(next.households[24].short, 'Bernasconi');
  assert.equal(addHousehold(next, { name: 'Doppelt', apartment: target.id }), next);
  assert.equal(addHousehold(PROJECT, { name: 'Nirgends', apartment: 'Z-99' }), PROJECT);
  const plan = planRochade(next);
  assert.ok(plan.assignments.some((a) => a.householdId === next.households[24].id));
  assert.equal(removeHousehold(next, next.households[24].id).households.length, 24);
});

test('addExternal clamps the window to the timeline and the planner can use it', () => {
  const next = addExternal(PROJECT, { name: 'Limmattalstrasse 5', rooms: 4.5, stepFree: true, availableFrom: 3, availableTo: 99 });
  const flat = next.external[2];
  assert.equal(flat.availableFrom, 3);
  assert.equal(flat.availableTo, PROJECT.timeline.months);
  assert.equal(removeExternal(next, flat.id).external.length, 2);
  assert.equal(planRochade(next).conflicts.length, 0);
});
