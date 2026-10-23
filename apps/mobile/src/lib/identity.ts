import { Storage } from 'expo-sqlite/kv-store'

export type Identity = { kind: 'household'; householdId: string } | { kind: 'verwaltung' }

const storageKey = 'rochade.identity'

const isIdentity = (value: unknown): value is Identity => {
  if (typeof value !== 'object' || value === null || !('kind' in value)) return false
  if (value.kind === 'verwaltung') return true
  return value.kind === 'household' && 'householdId' in value && typeof value.householdId === 'string'
}

export const readIdentity = (): Identity | null => {
  try {
    const raw = Storage.getItemSync(storageKey)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isIdentity(parsed) ? parsed : null
  } catch {
    return null
  }
}

export const writeIdentity = (identity: Identity) => {
  try {
    Storage.setItemSync(storageKey, JSON.stringify(identity))
  } catch {
    return
  }
}

export const clearIdentity = () => {
  try {
    Storage.removeItemSync(storageKey)
  } catch {
    return
  }
}
