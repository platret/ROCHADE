#!/usr/bin/env python3
"""Local server for the ROCHADE website. Like `python3 -m http.server`, but
- tells browsers not to cache, so updated JavaScript modules are always picked up, and
- forwards /api/flatfox/<pin|public-listing>/?... to the public Flatfox API (flatfox.ch/api/v1),
  because the browser may not call the pin endpoint directly (no CORS header). Only the two endpoints
  and a whitelist of query parameters are forwarded; answers are cached for five minutes.
Usage: python3 serve.py [port]"""
import json
import os
import ssl
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
ROOT = os.path.dirname(os.path.abspath(__file__))

FLATFOX_API = 'https://flatfox.ch/api/v1/'
PROXY_PREFIX = '/api/flatfox/'
ALLOWED_ENDPOINTS = {'pin', 'public-listing'}
ALLOWED_PARAMS = {'north', 'south', 'east', 'west', 'offer_type', 'object_category', 'max_count',
                  'min_rooms', 'max_rooms', 'max_price', 'is_temporary', 'limit', 'pk', 'ordering', 'status'}
CACHE_TTL_SECONDS = 300
CACHE_MAX_ENTRIES = 50
UPSTREAM_TIMEOUT_SECONDS = 20
USER_AGENT = 'Mozilla/5.0 (compatible; ROCHADE-Prototyp/1.0; +https://github.com/platret/ROCHADE)'

_cache = {}
_cache_lock = threading.Lock()


def make_ssl_context():
    """The python.org build on macOS does not see the system trust store; use certifi or the system bundle."""
    context = ssl.create_default_context()
    candidates = []
    try:
        import certifi
        candidates.append(certifi.where())
    except ImportError:
        pass
    candidates.append('/etc/ssl/cert.pem')
    for path in candidates:
        if os.path.exists(path):
            try:
                context.load_verify_locations(path)
                break
            except ssl.SSLError:
                continue
    return context


SSL_CONTEXT = make_ssl_context()


def fetch_flatfox(endpoint, query):
    """Return (status, body bytes) from Flatfox, served from the cache when fresh."""
    params = [(k, v) for k, v in urllib.parse.parse_qsl(query, keep_blank_values=False) if k in ALLOWED_PARAMS]
    url = FLATFOX_API + endpoint + '/' + ('?' + urllib.parse.urlencode(params) if params else '')
    now = time.time()
    with _cache_lock:
        hit = _cache.get(url)
        if hit and now - hit[0] < CACHE_TTL_SECONDS:
            return 200, hit[1]
    request = urllib.request.Request(url, headers={'User-Agent': USER_AGENT, 'Accept': 'application/json'})
    try:
        with urllib.request.urlopen(request, timeout=UPSTREAM_TIMEOUT_SECONDS, context=SSL_CONTEXT) as response:
            body = response.read()
    except urllib.error.HTTPError as err:
        return err.code, json.dumps({'error': f'Flatfox antwortet mit Status {err.code}'}).encode('utf-8')
    except Exception as err:  # network down, timeout, DNS
        return 502, json.dumps({'error': f'Flatfox nicht erreichbar ({err.__class__.__name__})'}).encode('utf-8')
    with _cache_lock:
        if len(_cache) >= CACHE_MAX_ENTRIES:
            _cache.clear()
        _cache[url] = (now, body)
    return 200, body


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, must-revalidate')
        super().end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlsplit(self.path)
        if not parsed.path.startswith(PROXY_PREFIX):
            return super().do_GET()
        endpoint = parsed.path[len(PROXY_PREFIX):].strip('/')
        if endpoint not in ALLOWED_ENDPOINTS:
            self.send_error(404, 'Unbekannter Endpunkt')
            return
        status, body = fetch_flatfox(endpoint, parsed.query)
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args):
        pass


if __name__ == '__main__':
    with ThreadingHTTPServer(('127.0.0.1', PORT), Handler) as httpd:
        print(f'ROCHADE: http://localhost:{PORT}/index.html  (Ordner {ROOT})')
        httpd.serve_forever()
