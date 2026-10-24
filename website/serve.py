#!/usr/bin/env python3
"""Local server for the ROCHADE website: like `python3 -m http.server`, but tells browsers not to cache,
so updated JavaScript modules are always picked up. Usage: python3 serve.py [port]"""
import os, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
ROOT = os.path.dirname(os.path.abspath(__file__))

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, must-revalidate')
        super().end_headers()
    def log_message(self, *args):
        pass

if __name__ == '__main__':
    with ThreadingHTTPServer(('127.0.0.1', PORT), Handler) as httpd:
        print(f'ROCHADE: http://localhost:{PORT}/index.html  (Ordner {ROOT})')
        httpd.serve_forever()
