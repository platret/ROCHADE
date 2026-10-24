import type { ISODate, Phase } from '@rochade/shared'
import { useEffect, useRef, useState } from 'react'

export type PhaseChange = { start_date: ISODate; end_date: ISODate; at: Date }

const shifted = (before: Phase, after: Phase) => before.start_date !== after.start_date || before.end_date !== after.end_date

export const usePhaseChanges = (phases: Phase[]): ReadonlyMap<string, PhaseChange> => {
  const previous = useRef<Map<string, Phase> | null>(null)
  const [changes, setChanges] = useState<ReadonlyMap<string, PhaseChange>>(() => new Map())

  useEffect(() => {
    const before = previous.current
    previous.current = new Map(phases.map((phase) => [phase.id, phase]))
    if (!before) return
    const at = new Date()
    const detected = phases.flatMap((phase) => {
      const old = before.get(phase.id)
      return old && shifted(old, phase) ? [[phase.id, { start_date: old.start_date, end_date: old.end_date, at }] as const] : []
    })
    if (detected.length > 0) setChanges((current) => new Map([...current, ...detected]))
  }, [phases])

  return changes
}
