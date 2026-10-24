// Copies the static ROCHADE website (repo folder website/) into public/site so Vite serves it next to the
// React app: /site/index.html, /site/login.html, /site/app.html. The key file js/env.js is never copied;
// vite.config.ts writes it from the VITE_SUPABASE_* variables instead. Skips quietly when website/ is absent
// (Vercel builds with the root directory apps/web still have the committed copy).
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const source = resolve(here, '../../../website')
const target = resolve(here, '../public/site')
const include = ['index.html', 'app.html', 'login.html', 'css', 'js', 'assets']
const exclude = new Set(['env.js', 'env.example.js', 'seed-rows.js'])

if (!existsSync(source)) {
  console.log(`sync-site: ${source} fehlt, public/site bleibt wie eingecheckt.`)
  process.exit(0)
}
rmSync(target, { recursive: true, force: true })
mkdirSync(target, { recursive: true })
for (const entry of include) {
  const from = join(source, entry)
  if (!existsSync(from)) continue
  cpSync(from, join(target, entry), { recursive: true, filter: (path) => !exclude.has(path.split('/').pop() ?? '') })
}
console.log(`sync-site: ${include.join(', ')} nach public/site kopiert (ohne js/env.js).`)
