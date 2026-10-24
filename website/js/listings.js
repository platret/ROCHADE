/* Finding Rochade flats outside the cooperative when the plan has conflicts.
   The demo pool below is fictional. In the product the same needs would drive a search on Flatfox, Homegate,
   ImmoScout24, partner cooperatives and the city; the research prompt and the links are real. */
import { monthLabel } from './planner.js';

export const LISTINGS = Object.freeze([
  { id: 'L-01', name: 'Rotbuchstrasse 8, 1. OG', quarter: 'Höngg', distance: '600 m', rooms: 2.5, stepFree: true, availableFrom: 0, availableTo: 20, rent: 1480, source: 'Flatfox', kind: 'Zwischenmiete' },
  { id: 'L-02', name: 'Limmattalstrasse 112, Parterre', quarter: 'Höngg', distance: '900 m', rooms: 3.5, stepFree: true, availableFrom: 2, availableTo: 14, rent: 1890, source: 'Partner-Genossenschaft', kind: 'befristet' },
  { id: 'L-03', name: 'Hönggerstrasse 50, 3. OG mit Lift', quarter: 'Wipkingen', distance: '1,4 km', rooms: 4.5, stepFree: true, availableFrom: 4, availableTo: 20, rent: 2350, source: 'Homegate', kind: 'Zwischenmiete' },
  { id: 'L-04', name: 'Regensbergstrasse 20, 2. OG', quarter: 'Höngg', distance: '1,1 km', rooms: 4.5, stepFree: false, availableFrom: 0, availableTo: 12, rent: 2190, source: 'Flatfox', kind: 'befristet' },
  { id: 'L-05', name: 'Ackersteinstrasse 3, Parterre', quarter: 'Höngg', distance: '700 m', rooms: 2.5, stepFree: true, availableFrom: 6, availableTo: 20, rent: 1390, source: 'Stadt Zürich Liegenschaften', kind: 'befristet' },
  { id: 'L-06', name: 'Winzerhalde 12, 1. OG mit Lift', quarter: 'Höngg', distance: '1,6 km', rooms: 3.5, stepFree: true, availableFrom: 0, availableTo: 20, rent: 1750, source: 'Partner-Genossenschaft', kind: 'befristet' },
  { id: 'L-07', name: 'Meierhofplatz 2, 4. OG mit Lift', quarter: 'Höngg', distance: '500 m', rooms: 4.5, stepFree: true, availableFrom: 5, availableTo: 18, rent: 2480, source: 'ImmoScout24', kind: 'Zwischenmiete' },
  { id: 'L-08', name: 'Riedhofstrasse 30, 2. OG', quarter: 'Höngg', distance: '1,2 km', rooms: 3.5, stepFree: false, availableFrom: 0, availableTo: 20, rent: 1690, source: 'Flatfox', kind: 'Zwischenmiete' },
  { id: 'L-09', name: 'Kappenbühlweg 9, Parterre', quarter: 'Höngg', distance: '1,0 km', rooms: 4.5, stepFree: true, availableFrom: 0, availableTo: 9, rent: 2290, source: 'Homegate', kind: 'befristet' },
  { id: 'L-10', name: 'Frankentalerstrasse 14, 1. OG', quarter: 'Höngg', distance: '800 m', rooms: 2.5, stepFree: false, availableFrom: 3, availableTo: 20, rent: 1420, source: 'ImmoScout24', kind: 'Zwischenmiete' },
  { id: 'L-11', name: 'Wieslergasse 6, 2. OG mit Lift', quarter: 'Wipkingen', distance: '1,8 km', rooms: 2.5, stepFree: true, availableFrom: 0, availableTo: 20, rent: 1560, source: 'Partner-Genossenschaft', kind: 'befristet' },
  { id: 'L-12', name: 'Gsteigstrasse 41, 3. OG', quarter: 'Höngg', distance: '1,3 km', rooms: 4.5, stepFree: false, availableFrom: 6, availableTo: 20, rent: 2240, source: 'Flatfox', kind: 'Zwischenmiete' },
]);

/** What is missing, grouped: same size, same step-free need, same window. */
export function needsFor(project, plan) {
  const byId = new Map(project.households.map((h) => [h.id, h]));
  const groups = new Map();
  for (const c of plan.conflicts) {
    const h = byId.get(c.householdId);
    if (!h) continue;
    const key = `${h.roomsMin}|${h.stepFree ? 1 : 0}|${c.from}|${c.to}`;
    const g = groups.get(key) || { roomsMin: h.roomsMin, stepFree: h.stepFree, from: c.from, to: c.to, households: [] };
    groups.set(key, { ...g, households: [...g.households, h] });
  }
  return [...groups.values()].sort((a, b) => Number(b.stepFree) - Number(a.stepFree) || b.roomsMin - a.roomsMin || a.from - b.from);
}

const fits = (flat, need) => flat.rooms >= need.roomsMin && (!need.stepFree || flat.stepFree) && flat.availableFrom <= need.from && flat.availableTo >= need.to;

/** Demo search: fictional listings that would fit at least one open need, best fit first, not yet adopted. */
export function findListings(project, plan, pool = LISTINGS) {
  const needs = needsFor(project, plan);
  if (!needs.length) return [];
  const taken = new Set(project.external.map((e) => e.id));
  const km = (d) => parseFloat(String(d).replace(',', '.')) * (String(d).includes('km') ? 1 : 0.001);
  return pool
    .filter((l) => !taken.has(l.id))
    .map((l) => {
      const solves = needs.filter((n) => fits(l, n));
      if (!solves.length) return null;
      const best = solves[0];
      const waste = l.rooms - best.roomsMin;
      return { ...l, solves, score: solves.reduce((s, n) => s + n.households.length, 0) * 10 - waste * 2 - km(l.distance) };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export function toExternal(listing) {
  return { id: listing.id, name: `${listing.name} (${listing.source})`, rooms: listing.rooms, stepFree: listing.stepFree, availableFrom: listing.availableFrom, availableTo: listing.availableTo };
}

/** A precise research brief for an AI assistant or a broker, built from the open needs. */
export function searchPrompt(project, needs) {
  const lines = needs.map((n) => `${n.households.length} × mindestens ${String(n.roomsMin).replace('.', ',')} Zimmer${n.stepFree ? ', hindernisfrei (Lift oder Parterre)' : ''}, verfügbar von ${monthLabel(project, n.from)} bis ${monthLabel(project, n.to - 1)}`);
  return [
    `Suche befristet verfügbare Mietwohnungen als Rochade-Wohnungen für die Etappensanierung der ${project.name} (${project.owner}), Zürich-Höngg.`,
    'Gesucht:',
    ...lines.map((l) => `- ${l}`),
    'Bedingungen: Umkreis bis 2 km um die Siedlung, Zwischenmiete oder befristeter Vertrag, leer oder möbliert, Bezug zum Monatsersten.',
    'Bitte liste konkrete Inserate von Flatfox, Homegate, ImmoScout24, Comparis, Partner-Genossenschaften (Wohnbaugenossenschaften Zürich) und Stadt Zürich Liegenschaften mit Adresse, Zimmerzahl, Stockwerk und Lift, Verfügbarkeit, Miete und Link. Markiere, welche Anforderung jedes Inserat erfüllt.',
  ].join('\n');
}

export function searchLinks(needs) {
  const rooms = needs.length ? Math.min(...needs.map((n) => n.roomsMin)) : 2.5;
  return [
    { name: 'Flatfox', url: `https://flatfox.ch/de/search/?query=Z%C3%BCrich%20H%C3%B6ngg&min_rooms=${rooms}` },
    { name: 'Homegate', url: `https://www.homegate.ch/mieten/immobilien/ort-zuerich/trefferliste?ac=${rooms}` },
    { name: 'ImmoScout24', url: `https://www.immoscout24.ch/de/wohnung/mieten/ort-zuerich?nrf=${rooms}` },
    { name: 'Wohnbaugenossenschaften Zürich', url: 'https://www.wbg-zh.ch/' },
  ];
}
