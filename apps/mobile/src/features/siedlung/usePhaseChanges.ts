import type { ISODate, Phase } from '@rochade/shared'
import { useEffect, useRef, useState } from 'react'

export type PhaseChange = { start_date: ISODate; end_date: ISODate; at: Date; changedAt: Date | null }

type Baseline = { phases: Map<string, Phase>; live: boolean }

const shifted = (before: Phase, after: Phase) => before.start_date !== after.start_date || before.end_date !== after.end_date

export const usePhaseChanges = (phases: Phase[], live: boolean): ReadonlyMap<string, PhaseChange> => {
  const previous = useRef<Baseline | null>(null)
  const [changes, setChanges] = useState<ReadonlyMap<string, PhaseChange>>(() => new Map())

  useEffect(() => {
    const before = previous.current
    previous.current = { phases: new Map(phases.map((phase) => [phase.id, phase])), live }
    if (!before) return
    const at = new Date()
    const changedAt = before.live ? at : null
    const detected = phases.flatMap((phase) => {
      const old = before.phases.get(phase.id)
      return old && shifted(old, phase) ? [[phase.id, { start_date: old.start_date, end_date: old.end_date, at, changedAt }] as const] : []
    })
    if (detected.length > 0) setChanges((current) => new Map([...current, ...detected]))
  }, [phases, live])

  return changes
}
