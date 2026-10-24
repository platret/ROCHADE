/* Real listings from the public Flatfox API (flatfox.ch/api/v1), the only Swiss portal with an open
   read API. Two calls: the map pins inside a box around the Siedlung, then the details of the nearest
   pins. The query carries only area, category and room filters, never household data.
   The pin endpoint sends no CORS header, so the calls go through the same-origin proxy of serve.py
   first (/api/flatfox) and fall back to flatfox.ch directly where no proxy runs.
   The helpers are pure and tested with a saved sample; searchFlatfox does the fetching. */

export const FLATFOX = 'https://flatfox.ch';
export const API_DIRECT = `${FLATFOX}/api/v1`;
export const API_PROXY = '/api/flatfox';
export const SEARCH_RADIUS_KM = 3;
export const MAX_DETAILS = 60;
/* The fictional Siedlung Brunnenwiese sits in Zürich-Höngg. */
export const SIEDLUNG = { lat: 47.4028, lng: 8.4961 };
export const STEP_FREE_ATTRIBUTES = ['lift', 'accessiblewithwheelchair'];

const KM_PER_DEGREE = 111.32;
const rad = (deg) => (deg * Math.PI) / 180;

export function bboxAround(center, km) {
  const dLat = km / KM_PER_DEGREE;
  const dLng = km / (KM_PER_DEGREE * Math.cos(rad(center.lat)));
  return { north: center.lat + dLat, south: center.lat - dLat, east: center.lng + dLng, west: center.lng - dLng };
}

export function distanceKm(a, b) {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function pinUrl(project, minRooms = null, { center = SIEDLUNG, km = SEARCH_RADIUS_KM, base = API_DIRECT } = {}) {
  const box = bboxAround(center, km);
  const q = new URLSearchParams({
    north: box.north.toFixed(5), south: box.south.toFixed(5), east: box.east.toFixed(5), west: box.west.toFixed(5),
    offer_type: 'RENT', object_category: 'APARTMENT', max_count: '500',
  });
  if (minRooms) q.set('min_rooms', String(Math.max(1, Math.floor(minRooms))));
  return `${base}/pin/?${q}`;
}

export function detailUrl(pks, { base = API_DIRECT } = {}) {
  const q = new URLSearchParams({ limit: String(pks.length) });
  for (const pk of pks) q.append('pk', String(pk));
  return `${base}/public-listing/?${q}`;
}

export function isStepFree(raw) {
  const attrs = new Set((raw.attributes || []).map((a) => a.name));
  return raw.floor === 0 || STEP_FREE_ATTRIBUTES.some((a) => attrs.has(a));
}

/** Month index on the project timeline for an ISO date; April 2027 is 0 in the demo. */
export function monthIndex(project, isoDate) {
  if (!isoDate) return null;
  const [y, m] = String(isoDate).split('-').map(Number);
  if (!y || !m) return null;
  return (y - project.timeline.startYear) * 12 + (m - project.timeline.startMonth);
}

const availableFromIndex = (project, raw) => {
  if (raw.moving_date_type === 'dat' && raw.moving_date) return Math.max(0, monthIndex(project, raw.moving_date) ?? 0);
  return 0; // sofort or nach Vereinbarung
};

/** One Flatfox record in the listing shape the planner and the status panel understand. Null if unusable. */
export function mapListing(raw, project, { center = SIEDLUNG } = {}) {
  const rooms = Number(raw.number_of_rooms);
  if (!Number.isFinite(rooms) || rooms <= 0) return null;
  const lat = Number(raw.latitude);
  const lng = Number(raw.longitude);
  const place = `${raw.zipcode || ''} ${raw.city || ''}`.trim();
  const address = raw.street ? (raw.public_address || `${raw.street}, ${place}`) : `${place} · Adresse im Inserat`;
  return {
    id: `FF-${raw.pk}`,
    pk: raw.pk,
    name: address,
    quarter: place,
    rooms,
    surface: raw.surface_living || null,
    floor: raw.floor ?? null,
    stepFree: isStepFree(raw),
    rent: raw.price_display ?? raw.rent_gross ?? raw.rent_net ?? null,
    temporary: Boolean(raw.is_temporary),
    movingDate: raw.moving_date || null,
    movingType: raw.moving_date_type || 'agr',
    availableFrom: availableFromIndex(project, raw),
    availableTo: Number.POSITIVE_INFINITY,
    distanceKm: Number.isFinite(lat) && Number.isFinite(lng) ? distanceKm(center, { lat, lng }) : null,
    source: 'Flatfox',
    kind: raw.is_temporary ? 'Zwischenmiete' : 'Mietwohnung',
    url: raw.url ? `${FLATFOX}${raw.url}` : `${FLATFOX}/${raw.pk}/`,
    agency: raw.agency && raw.agency.name ? raw.agency.name : null,
  };
}

const defaultFetch = (...args) => globalThis.fetch(...args);

/** Live search: pins in the box, details of the nearest pins, mapped and sorted by distance. Throws on failure. */
export async function searchFlatfox(project, { fetchImpl = defaultFetch, center = SIEDLUNG, km = SEARCH_RADIUS_KM, maxDetails = MAX_DETAILS, minRooms = null, bases = [API_PROXY, API_DIRECT] } = {}) {
  if (typeof fetchImpl !== 'function') throw new Error('Kein fetch verfügbar');
  const getJson = async (url) => {
    const res = await fetchImpl(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      let detail = '';
      try { detail = (await res.json()).error || ''; } catch { /* no json body */ }
      throw Object.assign(new Error(detail || `Flatfox antwortet mit Status ${res.status}`), { status: res.status });
    }
    return res.json();
  };
  /* The first base that answers the pin call is used for the detail call too. */
  let base = null;
  let pins = null;
  let firstError = null;
  for (const candidate of bases) {
    try {
      pins = await getJson(pinUrl(project, minRooms, { center, km, base: candidate }));
      base = candidate;
      break;
    } catch (err) {
      if (!(candidate === API_PROXY && err.status === 404)) firstError = firstError || err; // no proxy on static hosting
    }
  }
  if (base === null) throw firstError || new Error('Flatfox nicht erreichbar');
  if (!Array.isArray(pins)) throw new Error('Unerwartete Antwort von Flatfox');
  const nearest = pins
    .filter((p) => Number.isFinite(Number(p.latitude)) && Number.isFinite(Number(p.longitude)))
    .map((p) => ({ pk: p.pk, d: distanceKm(center, { lat: Number(p.latitude), lng: Number(p.longitude) }) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, maxDetails);
  if (!nearest.length) return { items: [], loaded: 0, pins: pins.length };
  const details = await getJson(detailUrl(nearest.map((p) => p.pk), { base }));
  const results = Array.isArray(details.results) ? details.results : [];
  const items = results
    .filter((r) => !r.object_category || r.object_category === 'APARTMENT')
    .map((r) => mapListing(r, project, { center }))
    .filter(Boolean)
    .sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
  return { items, loaded: items.length, pins: pins.length };
}
