import type { ISODate } from '@rochade/shared'

export type CalendarEntry = { date: ISODate; title: string; notes: string }

export type CalendarMemory = 'none' | 'current' | 'stale'

export type CalendarResult = { kind: 'created'; count: number } | { kind: 'denied' }

export const calendarMemory = (_householdId: string, _entries: CalendarEntry[]): CalendarMemory => 'none'

export const addToCalendar = async (_householdId: string, _entries: CalendarEntry[]): Promise<CalendarResult> => {
  throw new Error('Im Browser nicht verfügbar. Öffne ROCHADE auf dem iPhone, um die Termine einzutragen.')
}
