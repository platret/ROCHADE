const FLATFOX_API = 'https://flatfox.ch/api/v1/'
const ENDPOINTS = new Set(['pin', 'public-listing'])
const PARAMS = new Set(['north', 'south', 'east', 'west', 'offer_type', 'object_category', 'max_count',
  'min_rooms', 'max_rooms', 'max_price', 'is_temporary', 'limit', 'pk', 'ordering', 'status'])
const USER_AGENT = 'Mozilla/5.0 (compatible; ROCHADE-Prototyp/1.0; +https://github.com/platret/ROCHADE)'

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } })

export async function onRequestGet({ request, params }) {
  const endpoint = [].concat(params.path ?? []).filter(Boolean).join('/')
  if (!ENDPOINTS.has(endpoint)) return json(404, { error: 'Unbekannter Endpunkt' })
  const query = new URLSearchParams()
  for (const [key, value] of new URL(request.url).searchParams) if (PARAMS.has(key)) query.append(key, value)
  const qs = query.toString()
  try {
    const upstream = await fetch(`${FLATFOX_API}${endpoint}/${qs ? `?${qs}` : ''}`, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      cf: { cacheTtl: 300, cacheEverything: true },
      signal: AbortSignal.timeout(20000),
    })
    if (!upstream.ok) return json(upstream.status, { error: `Flatfox antwortet mit Status ${upstream.status}` })
    return new Response(upstream.body, {
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
    })
  } catch (err) {
    return json(502, { error: `Flatfox nicht erreichbar (${err && err.name ? err.name : 'Fehler'})` })
  }
}
