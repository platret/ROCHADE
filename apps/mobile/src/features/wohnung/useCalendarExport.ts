import { useState } from 'react'
import { addToCalendar, calendarMemory, type CalendarEntry } from '@/lib/calendar'
import { messageOf } from '@/lib/errors'
import { haptics } from '@/lib/haptics'

type Phase = 'idle' | 'working' | 'denied' | 'error'

export type CalendarStatus = Phase | 'done'

export type CalendarExport = {
  status: CalendarStatus
  stale: boolean
  error: string | null
  run: () => void
}

export const useCalendarExport = (householdId: string, entries: CalendarEntry[]): CalendarExport => {
  const [memory, setMemory] = useState(() => calendarMemory(householdId, entries))
  const [phase, setPhase] = useState<Phase>('idle')
  const [error, setError] = useState<string | null>(null)

  const run = async () => {
    setPhase('working')
    setError(null)
    try {
      const result = await addToCalendar(householdId, entries)
      if (result.kind === 'denied') {
        setPhase('denied')
        return
      }
      haptics.success()
      setMemory('current')
      setPhase('idle')
    } catch (caught) {
      haptics.error()
      setError(messageOf(caught))
      setPhase('error')
    }
  }

  const status: CalendarStatus = phase === 'idle' && memory === 'current' ? 'done' : phase

  return { status, stale: memory === 'stale', error, run: () => void run() }
}
