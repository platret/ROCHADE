import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'

// The static website under public/site reads its Supabase access from site/js/env.js. That file is never
// committed; it is written here from VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (apps/web/.env locally,
// the project variables on Vercel), in dev as a middleware and in the build into dist/site/js/env.js.
const siteEnv = (mode: string): Plugin => {
  const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env }
  const body = () =>
    `export const SUPABASE_URL = ${JSON.stringify(env.VITE_SUPABASE_URL ?? '')};\nexport const SUPABASE_KEY = ${JSON.stringify(env.VITE_SUPABASE_ANON_KEY ?? '')};\n`
  let outDir = 'dist'
  return {
    name: 'rochade-site-env',
    configResolved(config) {
      outDir = config.build.outDir
    },
    configureServer(server) {
      server.middlewares.use('/site/js/env.js', (_req, res) => {
        res.setHeader('Content-Type', 'text/javascript; charset=utf-8')
        res.setHeader('Cache-Control', 'no-store')
        res.end(body())
      })
    },
    closeBundle() {
      const dir = join(outDir, 'site', 'js')
      mkdirSync(dir, { recursive: true })
      writeFileSync(join(dir, 'env.js'), body())
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), siteEnv(mode)],
}))
