// Vercel serverless function: forwards /api/flatfox/<pin|public-listing>/?... to the public Flatfox API.
// The browser may not call the pin endpoint directly (no CORS header). Only two endpoints and a whitelist
// of query parameters are forwarded; answers are cached at the edge for five minutes. Mirrors website/serve.py.
const FLATFOX_API = 'https://flatfox.ch/api/v1/'
const ENDPOINTS = new Set(['pin', 'public-listing'])
const PARAMS = new Set(['north', 'south', 'east', 'west', 'offer_type', 'object_category', 'max_count', 'min_rooms', 'max_rooms', 'max_price', 'is_temporary', 'limit', 'pk', 'ordering', 'status'])

export default async function handler(req, res) {
  const segments = Array.isArray(req.query.path) ? req.query.path : [req.query.path].filter(Boolean)
  const endpoint = segments.join('/').replace(/\/+$/, '')
  if (req.method !== 'GET' || !ENDPOINTS.has(endpoint)) {
    res.status(404).json({ error: 'Unbekannter Endpunkt' })
    return
  }
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(req.query)) {
    if (!PARAMS.has(key)) continue
    for (const v of Array.isArray(value) ? value : [value]) query.append(key, String(v))
  }
  const url = `${FLATFOX_API}${endpoint}/${query.size ? `?${query}` : ''}`
  try {
    const upstream = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ROCHADE-Prototyp/1.0; +https://github.com/platret/ROCHADE)', Accept: 'application/json' },
      signal: AbortSignal.timeout(20000),
    })
    const body = await upstream.text()
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    res.status(upstream.ok ? 200 : upstream.status).send(upstream.ok ? body : JSON.stringify({ error: `Flatfox antwortet mit Status ${upstream.status}` }))
  } catch (err) {
    res.status(502).json({ error: `Flatfox nicht erreichbar (${err && err.name ? err.name : 'Fehler'})` })
  }
}
