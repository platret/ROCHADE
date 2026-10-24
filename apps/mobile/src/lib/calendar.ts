import type { ISODate } from '@rochade/shared'
import {
  createEventAsync,
  deleteEventAsync,
  EntityTypes,
  getCalendarsAsync,
  getDefaultCalendarAsync,
  requestCalendarPermissionsAsync,
  type Calendar,
} from 'expo-calendar/legacy'
import { Storage } from 'expo-sqlite/kv-store'
import { Platform } from 'react-native'

export type CalendarEntry = { date: ISODate; title: string; notes: string }

export type CalendarMemory = 'none' | 'current' | 'stale'

export type CalendarResult = { kind: 'created'; count: number } | { kind: 'denied' }

type Remembered = { ids: string[]; fingerprint: string }

const dayMs = 86_400_000

const memoryKey = (householdId: string) => `calendar:${householdId}`

const fingerprintOf = (entries: CalendarEntry[]) => entries.map((entry) => `${entry.date} ${entry.title}`).join('\n')

const isRemembered = (value: unknown): value is Remembered =>
  typeof value === 'object' &&
  value !== null &&
  'ids' in value &&
  Array.isArray(value.ids) &&
  'fingerprint' in value &&
  typeof value.fingerprint === 'string'

const readRemembered = (householdId: string): Remembered | null => {
  try {
    const raw = Storage.getItemSync(memoryKey(householdId))
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isRemembered(parsed) ? parsed : null
  } catch {
    return null
  }
}

const writeRemembered = (householdId: string, remembered: Remembered) => {
  try {
    Storage.setItemSync(memoryKey(householdId), JSON.stringify(remembered))
  } catch {
    return
  }
}

export const calendarMemory = (householdId: string, entries: CalendarEntry[]): CalendarMemory => {
  const remembered = readRemembered(householdId)
  if (!remembered) return 'none'
  return remembered.fingerprint === fingerprintOf(entries) ? 'current' : 'stale'
}

const localMidnight = (iso: ISODate) => {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1)
}

const allDayEvent = ({ date, title, notes }: CalendarEntry) => {
  const startDate = localMidnight(date)
  return { title, notes, allDay: true, startDate, endDate: new Date(startDate.getTime() + dayMs - 1000) }
}

const writableCalendar = async (): Promise<Calendar> => {
  if (Platform.OS === 'ios') return getDefaultCalendarAsync()
  const writable = (await getCalendarsAsync(EntityTypes.EVENT)).filter((calendar) => calendar.allowsModifications)
  const calendar = writable.find((candidate) => candidate.isPrimary) ?? writable[0]
  if (!calendar) throw new Error('Auf diesem Gerät wurde kein beschreibbarer Kalender gefunden.')
  return calendar
}

const removeQuietly = (ids: string[]) => Promise.all(ids.map((id) => deleteEventAsync(id).catch(() => undefined)))

export const addToCalendar = async (householdId: string, entries: CalendarEntry[]): Promise<CalendarResult> => {
  const permission = await requestCalendarPermissionsAsync()
  if (!permission.granted) return { kind: 'denied' }
  const calendar = await writableCalendar()
  await removeQuietly(readRemembered(householdId)?.ids ?? [])
  const ids: string[] = []
  for (const entry of entries) ids.push(await createEventAsync(calendar.id, allDayEvent(entry)))
  writeRemembered(householdId, { ids, fingerprint: fingerprintOf(entries) })
  return { kind: 'created', count: ids.length }
}
