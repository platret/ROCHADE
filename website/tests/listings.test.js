import test from 'node:test';
import assert from 'node:assert/strict';
import { PROJECT } from '../js/data.js';
import { planRochade } from '../js/planner.js';
import { addExternal } from '../js/edit.js';
import { needsFor, findListings, toExternal, searchPrompt, searchLinks } from '../js/listings.js';

const shifted = { P1: 2, P2: 6, P3: 12 };

test('needs are grouped by size, step-free and window and name the households', () => {
  const plan = planRochade(PROJECT, shifted);
  assert.ok(plan.conflicts.length > 0);
  const needs = needsFor(PROJECT, plan);
  assert.equal(needs.reduce((s, n) => s + n.households.length, 0), plan.conflicts.length);
  assert.ok(needs.every((n) => n.from < n.to && n.roomsMin > 0));
});

test('findListings returns only flats that fit an open need and adopting them removes conflicts', () => {
  let project = PROJECT;
  let plan = planRochade(project, shifted);
  const before = plan.conflicts.length;
  const results = findListings(project, plan);
  assert.ok(results.length > 0 && results.length <= 8);
  for (const r of results) assert.ok(r.solves.length > 0);
  project = addExternal(project, toExternal(results[0]));
  plan = planRochade(project, shifted);
  assert.ok(plan.conflicts.length < before);
  const again = findListings(project, plan);
  assert.ok(!again.some((r) => r.id === results[0].id));
});

test('no conflicts, no listings; prompt and links carry the needs', () => {
  const plan = planRochade(PROJECT);
  assert.deepEqual(findListings(PROJECT, plan), []);
  const needs = needsFor(PROJECT, planRochade(PROJECT, shifted));
  const prompt = searchPrompt(PROJECT, needs);
  assert.match(prompt, /Rochade-Wohnungen/);
  assert.match(prompt, /Zimmer/);
  assert.equal(searchLinks(needs).length, 4);
});
