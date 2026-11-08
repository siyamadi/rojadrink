from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent
DATA = ROOT / 'nasimie-roja-data.json'

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if self.path == '/api/load':
            if DATA.exists():
                raw = DATA.read_text(encoding='utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(raw.encode('utf-8'))))
                self.end_headers()
                self.wfile.write(raw.encode('utf-8'))
            else:
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'menus': [], 'settings': {}}).encode())
            return
        return super().do_GET()

    def do_POST(self):
        if self.path != '/api/save':
            self.send_error(404)
            return
        try:
            size = int(self.headers.get('Content-Length', '0'))
            if size <= 0 or size > 50 * 1024 * 1024:
                raise ValueError('Ukuran data tidak valid')
            payload = json.loads(self.rfile.read(size).decode('utf-8'))
            if not isinstance(payload, dict) or not isinstance(payload.get('menus'), list):
                raise ValueError('Format data menu tidak valid')
            tmp = DATA.with_suffix('.json.tmp')
            encoded = json.dumps(payload, ensure_ascii=False, indent=2).encode('utf-8')
            tmp.write_bytes(encoded)
            tmp.replace(DATA)
            body = json.dumps({'ok': True, 'bytes': DATA.stat().st_size}).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except Exception as exc:
            body = json.dumps({'ok': False, 'error': str(exc)}).encode()
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)

if __name__ == '__main__':
    print('ROJA DRINK berjalan di http://127.0.0.1:8765')
    print('Data otomatis disimpan ke:', DATA)
    print('Jangan tutup jendela hitam ini selama aplikasi digunakan.')
    ThreadingHTTPServer(('127.0.0.1', 8765), Handler).serve_forever()
