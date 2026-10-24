import type { ProjectData } from '@rochade/shared'
import { Storage } from 'expo-sqlite/kv-store'
import { supabaseHost } from '@/lib/supabase'

export type ProjectSnapshot = { projectId: string; data: ProjectData; updatedAt: Date }

type StoredSnapshot = { host: string | null; projectId: string; data: ProjectData; updatedAt: string }

const storageKey = 'project-snapshot'
const listKeys = ['phases', 'flats', 'households', 'assignments'] as const

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

const isProjectData = (value: unknown): value is ProjectData =>
  isRecord(value) && isRecord(value.project) && listKeys.every((key) => Array.isArray(value[key]))

const isStoredSnapshot = (value: unknown): value is StoredSnapshot =>
  isRecord(value) &&
  (value.host === null || typeof value.host === 'string') &&
  typeof value.projectId === 'string' &&
  typeof value.updatedAt === 'string' &&
  isProjectData(value.data)

const parseSnapshot = (raw: string): ProjectSnapshot | null => {
  const stored: unknown = JSON.parse(raw)
  if (!isStoredSnapshot(stored) || stored.host !== supabaseHost) return null
  const updatedAt = new Date(stored.updatedAt)
  return Number.isNaN(updatedAt.getTime()) ? null : { projectId: stored.projectId, data: stored.data, updatedAt }
}

const clearSnapshot = () => {
  try {
    Storage.removeItemSync(storageKey)
  } catch {
    return
  }
}

export const readSnapshot = (): ProjectSnapshot | null => {
  try {
    const raw = Storage.getItemSync(storageKey)
    const snapshot = raw ? parseSnapshot(raw) : null
    if (raw && !snapshot) clearSnapshot()
    return snapshot
  } catch {
    clearSnapshot()
    return null
  }
}

export const writeSnapshot = ({ projectId, data, updatedAt }: ProjectSnapshot) => {
  try {
    const stored: StoredSnapshot = { host: supabaseHost, projectId, data, updatedAt: updatedAt.toISOString() }
    Storage.setItemSync(storageKey, JSON.stringify(stored))
  } catch {
    return
  }
}
