import { supabaseHost } from './supabase'

type Probe = { label: string; url: string }

const probes = (): Probe[] => [
  { label: 'Supabase', url: `https://${supabaseHost}/rest/v1/` },
  { label: 'Internet', url: 'https://www.apple.com/library/test/success.html' },
]

const check = async ({ label, url }: Probe) => {
  const started = Date.now()
  try {
    const response = await fetch(url)
    return `${label} erreichbar (HTTP ${response.status}, ${Date.now() - started} ms)`
  } catch (error) {
    return `${label} nicht erreichbar: ${error instanceof Error ? error.message : String(error)}`
  }
}

export const connectionReport = async () => {
  const lines = await Promise.all(probes().map(check))
  console.info('[rochade] Verbindungstest', lines)
  return lines.join('\n')
}

export const withTimeout = <T>(promise: Promise<T>, ms: number) =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Keine Antwort vom Server nach ${ms / 1000} s`)), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error: unknown) => {
        clearTimeout(timer)
        reject(error instanceof Error ? error : new Error(String(error)))
      },
    )
  })
