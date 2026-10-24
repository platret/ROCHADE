import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PROJECT } from '../js/data.js';
import {
  validateProject, phaseWindow, planRochade, diffPlans, stateAt, suggestStart, temporaryFlats, monthLabel,
} from '../js/planner.js';

const defaults = () => Object.fromEntries(PROJECT.phases.map((p) => [p.id, p.start]));

test('fixture is internally consistent', () => {
  assert.deepEqual(validateProject(PROJECT), []);
  assert.equal(PROJECT.households.length, 24);
  assert.equal(PROJECT.buildings.length, 3);
  assert.equal(temporaryFlats(PROJECT).length, 11);
});

test('default phase plan is feasible and places every household', () => {
  const plan = planRochade(PROJECT, defaults());
  assert.equal(plan.conflicts.length, 0);
  assert.equal(plan.assignments.length, 24);
  assert.ok(plan.assignments.every((a) => a.flatId));
});

test('planner never violates a hard constraint', () => {
  const starts = { ...defaults(), P2: 2 };
  const plan = planRochade(PROJECT, starts);
  const flats = new Map(temporaryFlats(PROJECT).map((f) => [f.id, f]));
  const households = new Map(PROJECT.households.map((h) => [h.id, h]));
  for (const a of plan.assignments.filter((x) => x.flatId)) {
    const flat = flats.get(a.flatId);
    const h = households.get(a.householdId);
    assert.ok(flat.rooms >= h.roomsMin, `${h.id} rooms`);
    if (h.stepFree) assert.ok(flat.stepFree, `${h.id} step-free`);
    for (let m = a.from; m < a.to; m++) assert.ok(flat.availableAt(m, plan.phases), `${a.flatId} available at ${m}`);
  }
  const byFlat = new Map();
  for (const a of plan.assignments.filter((x) => x.flatId)) {
    const list = byFlat.get(a.flatId) || [];
    for (const other of list) assert.ok(a.to <= other.from || other.to <= a.from, `${a.flatId} double booked`);
    byFlat.set(a.flatId, [...list, a]);
  }
});

test('overlapping phases produce explained conflicts', () => {
  const plan = planRochade(PROJECT, { ...defaults(), P2: 2 });
  assert.ok(plan.conflicts.length > 0);
  assert.ok(plan.warnings.some((w) => w.type === 'overlap'));
  const c = plan.conflicts[0];
  assert.ok(c.householdId && c.phaseId && typeof c.reason === 'string');
  assert.ok(c.counts.fitRooms >= c.counts.fitStepFree);
});

test('planner is deterministic', () => {
  const a = planRochade(PROJECT, defaults());
  const b = planRochade(PROJECT, defaults());
  assert.deepEqual(a.assignments, b.assignments);
});

test('diffPlans lists affected households after a delay', () => {
  const before = planRochade(PROJECT, defaults());
  const after = planRochade(PROJECT, { ...defaults(), P1: 2 });
  const diff = diffPlans(before, after);
  assert.ok(diff.affected.length >= 8, 'at least the delayed building is affected');
  assert.ok(diff.affected.every((x) => x.householdId && x.change));
});

test('one month of delay is absorbed by the reserve, two months are not', () => {
  assert.equal(planRochade(PROJECT, { ...defaults(), P1: 1 }).conflicts.length, 0);
  assert.ok(planRochade(PROJECT, { ...defaults(), P1: 2 }).conflicts.length > 0);
});

test('suggestStart finds a conflict-free start when one exists', () => {
  const starts = { ...defaults(), P1: 2 };
  const plan = planRochade(PROJECT, starts);
  assert.ok(plan.conflicts.length > 0);
  const suggestion = suggestStart(PROJECT, starts, 'P2');
  assert.ok(suggestion !== null);
  assert.equal(planRochade(PROJECT, { ...starts, P2: suggestion }).conflicts.length, 0);
});

test('stateAt reports renovation, temporary occupancy and vacancy', () => {
  const plan = planRochade(PROJECT, defaults());
  const { start } = phaseWindow(plan.phases.find((p) => p.id === 'P1'));
  const state = stateAt(PROJECT, plan, start);
  const aFlats = state.apartments.filter((s) => s.building === 'A');
  assert.ok(aFlats.every((s) => s.status === 'renovation'));
  assert.ok(state.apartments.some((s) => s.status === 'temp' && s.householdId));
  assert.ok(state.moves.out.length === 8 && state.moves.back.length === 0);
});

test('monthLabel renders Swiss German month names', () => {
  assert.equal(monthLabel(PROJECT, 0), 'April 2027');
  assert.equal(monthLabel(PROJECT, 0, 'short'), 'Apr 27');
});
