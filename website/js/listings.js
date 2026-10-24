/* Finding Rochade flats outside the cooperative when the plan has conflicts.
   The live search (js/flatfox.js) delivers real listings in this same shape; the demo pool below is
   fictional and only used as the offline fallback. The research prompt and the portal links are real. */
import { monthLabel } from './planner.js';

export const LISTINGS = Object.freeze([
  { id: 'L-01', name: 'Rotbuchstrasse 8, 1. OG', quarter: 'Höngg', distanceKm: 0.6, rooms: 2.5, stepFree: true, availableFrom: 0, availableTo: 20, rent: 1480, source: 'Flatfox', kind: 'Zwischenmiete' },
  { id: 'L-02', name: 'Limmattalstrasse 112, Parterre', quarter: 'Höngg', distanceKm: 0.9, rooms: 3.5, stepFree: true, availableFrom: 2, availableTo: 14, rent: 1890, source: 'Partner-Genossenschaft', kind: 'befristet' },
  { id: 'L-03', name: 'Hönggerstrasse 50, 3. OG mit Lift', quarter: 'Wipkingen', distanceKm: 1.4, rooms: 4.5, stepFree: true, availableFrom: 4, availableTo: 20, rent: 2350, source: 'Homegate', kind: 'Zwischenmiete' },
  { id: 'L-04', name: 'Regensbergstrasse 20, 2. OG', quarter: 'Höngg', distanceKm: 1.1, rooms: 4.5, stepFree: false, availableFrom: 0, availableTo: 12, rent: 2190, source: 'Flatfox', kind: 'befristet' },
  { id: 'L-05', name: 'Ackersteinstrasse 3, Parterre', quarter: 'Höngg', distanceKm: 0.7, rooms: 2.5, stepFree: true, availableFrom: 6, availableTo: 20, rent: 1390, source: 'Stadt Zürich Liegenschaften', kind: 'befristet' },
  { id: 'L-06', name: 'Winzerhalde 12, 1. OG mit Lift', quarter: 'Höngg', distanceKm: 1.6, rooms: 3.5, stepFree: true, availableFrom: 0, availableTo: 20, rent: 1750, source: 'Partner-Genossenschaft', kind: 'befristet' },
  { id: 'L-07', name: 'Meierhofplatz 2, 4. OG mit Lift', quarter: 'Höngg', distanceKm: 0.5, rooms: 4.5, stepFree: true, availableFrom: 5, availableTo: 18, rent: 2480, source: 'ImmoScout24', kind: 'Zwischenmiete' },
  { id: 'L-08', name: 'Riedhofstrasse 30, 2. OG', quarter: 'Höngg', distanceKm: 1.2, rooms: 3.5, stepFree: false, availableFrom: 0, availableTo: 20, rent: 1690, source: 'Flatfox', kind: 'Zwischenmiete' },
  { id: 'L-09', name: 'Kappenbühlweg 9, Parterre', quarter: 'Höngg', distanceKm: 1.0, rooms: 4.5, stepFree: true, availableFrom: 0, availableTo: 9, rent: 2290, source: 'Homegate', kind: 'befristet' },
  { id: 'L-10', name: 'Frankentalerstrasse 14, 1. OG', quarter: 'Höngg', distanceKm: 0.8, rooms: 2.5, stepFree: false, availableFrom: 3, availableTo: 20, rent: 1420, source: 'ImmoScout24', kind: 'Zwischenmiete' },
  { id: 'L-11', name: 'Wieslergasse 6, 2. OG mit Lift', quarter: 'Wipkingen', distanceKm: 1.8, rooms: 2.5, stepFree: true, availableFrom: 0, availableTo: 20, rent: 1560, source: 'Partner-Genossenschaft', kind: 'befristet' },
  { id: 'L-12', name: 'Gsteigstrasse 41, 3. OG', quarter: 'Höngg', distanceKm: 1.3, rooms: 4.5, stepFree: false, availableFrom: 6, availableTo: 20, rent: 2240, source: 'Flatfox', kind: 'Zwischenmiete' },
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

/* A Rochade flat should be adequate, close and affordable, not the biggest flat on the market:
   households it serves count for it; oversize, distance and rent above the usual range count against it;
   a temporary let is a plus. Listings without floor area or with an implausible rent are doubtful and go last. */
export const RENT_CEILING = 3000;
export const MIN_RENT_PER_ROOM = 300;
export const isDoubtful = (l) => (l.surface === null && l.source === 'Flatfox') || (Number(l.rent) > 0 && Number(l.rent) < MIN_RENT_PER_ROOM * l.rooms);
export function scoreListing(l, solves) {
  const households = solves.reduce((s, n) => s + n.households.length, 0);
  const waste = l.rooms - solves[0].roomsMin;
  const rent = Number(l.rent) || 0;
  return households * 10
    - waste * 10
    - (l.distanceKm ?? 2) * 2
    - Math.max(0, rent - RENT_CEILING) / 100
    + (l.temporary || l.kind === 'Zwischenmiete' ? 3 : 0);
}

/** Listings that fit at least one open need, best fit first, not yet adopted. Works for live and demo pools. */
export function findListings(project, plan, pool = LISTINGS, limit = 8) {
  const needs = needsFor(project, plan);
  if (!needs.length) return [];
  const taken = new Set(project.external.map((e) => e.id));
  return pool
    .filter((l) => !taken.has(l.id))
    .map((l) => {
      const solves = needs.filter((n) => fits(l, n));
      if (!solves.length) return null;
      return { ...l, solves, score: scoreListing(l, solves), doubtful: isDoubtful(l) };
    })
    .filter(Boolean)
    .sort((a, b) => Number(a.doubtful) - Number(b.doubtful) || b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit);
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
    'Bedingungen: Umkreis bis 3 km um die Siedlung, Zwischenmiete oder befristeter Vertrag, leer oder möbliert, Bezug zum Monatsersten.',
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
