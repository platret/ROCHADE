import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'dist')
const include = ['index.html', 'app.html', 'login.html', 'css', 'js', 'assets']
const exclude = new Set(['env.js', 'env.example.js', 'seed-rows.js'])
const url = (process.env.SUPABASE_URL ?? '').trim()
const key = (process.env.SUPABASE_KEY ?? '').trim()

if (process.env.CF_PAGES && (!url || !key)) {
  console.error('build-site: SUPABASE_URL und SUPABASE_KEY fehlen in den Variablen des Pages-Projekts.')
  process.exit(1)
}
if (key.startsWith('sb_secret_') || key.includes('service_role')) {
  console.error('build-site: SUPABASE_KEY muss der publishable Key sein, nie ein Secret-Key.')
  process.exit(1)
}
rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })
for (const entry of include) {
  cpSync(join(root, entry), join(out, entry), { recursive: true, filter: (path) => !exclude.has(basename(path)) })
}
writeFileSync(join(out, 'js', 'env.js'),
  `export const SUPABASE_URL = ${JSON.stringify(url)};\nexport const SUPABASE_KEY = ${JSON.stringify(key)};\n`)
console.log(`build-site: ${include.join(', ')} nach dist kopiert, js/env.js ${url && key ? 'mit' : 'ohne'} Supabase-Zugang.`)
