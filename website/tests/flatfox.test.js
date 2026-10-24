import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PROJECT } from '../js/data.js';
import { planRochade } from '../js/planner.js';
import { bboxAround, distanceKm, pinUrl, detailUrl, mapListing, monthIndex, isStepFree, searchFlatfox, SIEDLUNG } from '../js/flatfox.js';
import { findListings, needsFor, toExternal } from '../js/listings.js';
import { addExternal } from '../js/edit.js';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/flatfox-sample.json', import.meta.url)));
const shifted = { P1: 2, P2: 6, P3: 12 };

test('the search box spans 3 km around the Siedlung and the pin url carries only area, category and rooms', () => {
  const box = bboxAround(SIEDLUNG, 3);
  assert.ok(box.north > SIEDLUNG.lat && box.south < SIEDLUNG.lat && box.east > SIEDLUNG.lng && box.west < SIEDLUNG.lng);
  assert.ok(Math.abs(distanceKm(SIEDLUNG, { lat: box.north, lng: SIEDLUNG.lng }) - 3) < 0.05);
  const url = new URL(pinUrl(PROJECT, 2.5));
  assert.equal(url.origin + url.pathname, 'https://flatfox.ch/api/v1/pin/');
  assert.equal(url.searchParams.get('offer_type'), 'RENT');
  assert.equal(url.searchParams.get('object_category'), 'APARTMENT');
  assert.equal(url.searchParams.get('min_rooms'), '2');
  assert.ok(!/Meier|H0\d/.test(url.search));
  assert.deepEqual(new URL(detailUrl([1, 2])).searchParams.getAll('pk'), ['1', '2']);
});

test('month index is relative to the project timeline, April 2027 = 0', () => {
  assert.equal(monthIndex(PROJECT, '2027-04-01'), 0);
  assert.equal(monthIndex(PROJECT, '2027-10-15'), 6);
  assert.equal(monthIndex(PROJECT, '2026-11-01'), -5);
  assert.equal(monthIndex(PROJECT, null), null);
});

test('a real Flatfox record maps to the listing shape the planner understands', () => {
  const raw = fixture.results.find((r) => r.pk === 86321299);
  const l = mapListing(raw, PROJECT);
  assert.equal(l.id, 'FF-86321299');
  assert.equal(l.name, 'Baslerstrasse 44, 8048 Zürich');
  assert.equal(l.rooms, 1.5);
  assert.equal(l.rent, 1509);
  assert.equal(l.availableFrom, 0);
  assert.equal(l.availableTo, Number.POSITIVE_INFINITY);
  assert.equal(l.url, 'https://flatfox.ch/en/flat/baslerstrasse-44-8048-zurich/86321299/');
  assert.ok(l.distanceKm > 0 && l.distanceKm < 6);
  assert.equal(isStepFree({ floor: 0, attributes: [] }), true);
  assert.equal(isStepFree({ floor: 3, attributes: [{ name: 'lift' }] }), true);
  assert.equal(isStepFree({ floor: 3, attributes: [{ name: 'balconygarden' }] }), false);
  assert.equal(mapListing({ pk: 1, number_of_rooms: null }, PROJECT), null);
});

test('searchFlatfox asks for pins, then the nearest details, and returns listings sorted by distance', async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    if (url.includes('/pin/')) return { ok: true, json: async () => fixture.results.map((r) => ({ pk: r.pk, latitude: r.latitude, longitude: r.longitude })) };
    return { ok: true, json: async () => ({ count: fixture.results.length, results: fixture.results }) };
  };
  const { items, loaded } = await searchFlatfox(PROJECT, { fetchImpl, maxDetails: 5 });
  assert.equal(calls.length, 2);
  assert.ok(calls[0].startsWith('/api/flatfox/pin/'));
  assert.ok(calls[1].startsWith('/api/flatfox/public-listing/'));
  assert.equal(new URL(calls[1], 'http://localhost').searchParams.getAll('pk').length, 5);
  assert.ok(items.length > 0 && items.length <= fixture.results.length);
  assert.equal(loaded, items.length);
  assert.ok(items.every((l) => l.source === 'Flatfox' && l.rooms > 0));
  for (let i = 1; i < items.length; i++) assert.ok(items[i - 1].distanceKm <= items[i].distanceKm);
});

test('real listings are matched to the open needs and an adopted one becomes a Rochade flat', () => {
  const plan = planRochade(PROJECT, shifted);
  assert.ok(plan.conflicts.length > 0);
  const pool = fixture.results.map((r) => mapListing(r, PROJECT)).filter(Boolean);
  const needs = needsFor(PROJECT, plan);
  const hits = findListings(PROJECT, plan, pool);
  assert.ok(hits.length > 0);
  assert.ok(hits.every((h) => h.solves.length > 0));
  assert.ok(hits.every((h) => needs.some((n) => h.rooms >= n.roomsMin && (!n.stepFree || h.stepFree))));
  const next = addExternal(PROJECT, toExternal(hits[0]));
  assert.equal(next.external[2].id, hits[0].id);
  assert.equal(next.external[2].availableTo, Number.POSITIVE_INFINITY);
  assert.ok(planRochade(next, shifted).conflicts.length < plan.conflicts.length);
});

test('ranking prefers an adequate, affordable flat over an oversized expensive one and over implausible listings', () => {
  const plan = planRochade(PROJECT, shifted);
  const base = { stepFree: true, availableFrom: 0, availableTo: Number.POSITIVE_INFINITY, distanceKm: 1, source: 'Flatfox', kind: 'Mietwohnung' };
  const pool = [
    { ...base, id: 'big', name: 'Villa', rooms: 5.5, surface: 170, rent: 6690 },
    { ...base, id: 'fit', name: 'Passend', rooms: 4.5, surface: 100, rent: 2800 },
    { ...base, id: 'odd', name: 'Ohne Fläche', rooms: 5.5, surface: null, rent: 862 },
  ];
  const hits = findListings(PROJECT, plan, pool);
  assert.deepEqual(hits.map((h) => h.id), ['fit', 'big', 'odd']);
});

test('searchFlatfox reports an http failure instead of an empty result', async () => {
  await assert.rejects(searchFlatfox(PROJECT, { fetchImpl: async () => ({ ok: false, status: 503, json: async () => ({}) }) }), /503/);
});

test('without a proxy (404) the search falls back to flatfox.ch directly', async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    if (url.startsWith('/api/flatfox/')) return { ok: false, status: 404, json: async () => { throw new Error('html'); } };
    if (url.includes('/pin/')) return { ok: true, json: async () => fixture.results.slice(0, 3).map((r) => ({ pk: r.pk, latitude: r.latitude, longitude: r.longitude })) };
    return { ok: true, json: async () => ({ count: 3, results: fixture.results.slice(0, 3) }) };
  };
  const { items } = await searchFlatfox(PROJECT, { fetchImpl });
  assert.equal(calls.length, 3);
  assert.ok(calls[1].startsWith('https://flatfox.ch/api/v1/pin/'));
  assert.ok(calls[2].startsWith('https://flatfox.ch/api/v1/public-listing/'));
  assert.equal(items.length, 3);
});
