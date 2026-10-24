import { messageOf } from './errors'
import { supabaseHost, supabaseUrl } from './supabase'

const connectionErrorMessage = 'Keine Verbindung zum Server. Prüfe WLAN und versuche es erneut.'

export const serverLine = `Server: ${supabaseHost ?? 'nicht konfiguriert'}`

const probeTimeoutMs = 5_000
const timeoutName = 'TimeoutError'
const fetchFailure = /network request failed|failed to fetch|fetcherror|typeerror/i

const timeoutError = (ms: number) => Object.assign(new Error(`Keine Antwort nach ${ms / 1000} s`), { name: timeoutName })

export const withTimeout = <T>(promise: Promise<T>, ms: number) =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(timeoutError(ms)), ms)
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

const isConnectionFailure = (error: unknown) =>
  error instanceof Error && (error.name === timeoutName || fetchFailure.test(error.message))

export const loadErrorMessage = (error: unknown) => (isConnectionFailure(error) ? connectionErrorMessage : messageOf(error))

type Probe = { label: string; url: string }

const probes = (): Probe[] => [
  { label: 'Supabase', url: `${supabaseUrl}/rest/v1/` },
  { label: 'Internet', url: 'https://www.apple.com/library/test/success.html' },
]

const check = async ({ label, url }: Probe) => {
  const started = Date.now()
  try {
    const response = await withTimeout(fetch(url), probeTimeoutMs)
    return `${label} erreichbar (HTTP ${response.status}, ${Date.now() - started} ms)`
  } catch (error) {
    return `${label} nicht erreichbar: ${messageOf(error)}`
  }
}

export const connectionReport = async () => {
  const lines = [serverLine, ...(await Promise.all(probes().map(check)))]
  console.info('[rochade] Verbindungstest', lines)
  return lines.join('\n')
}
