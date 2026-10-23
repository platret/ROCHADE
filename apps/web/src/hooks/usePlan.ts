import { replan, shiftPhase, type Phase, type RochadeClient, type UUID } from '@rochade/shared'
import { useEffect, useRef, useState } from 'react'
import { errorMessage } from '../lib/errors'

type PlanState = { busy: boolean; toast: string | null; error: string | null }
export type PlanActions = PlanState & { shift: (phase: Phase, days: number) => void; recalculate: () => void }

const idle: PlanState = { busy: false, toast: null, error: null }
const toastMs = 4000

const updatedText = (changed: number) =>
  `Plan aktualisiert · ${changed} ${changed === 1 ? 'Zuteilung' : 'Zuteilungen'} geändert`

export const usePlan = (client: RochadeClient, projectId: UUID): PlanActions => {
  const [state, setState] = useState<PlanState>(idle)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const run = async (prepare?: () => Promise<unknown>) => {
    clearTimeout(timer.current)
    setState({ ...idle, busy: true })
    try {
      await prepare?.()
      const { changed } = await replan(client, projectId)
      setState({ ...idle, toast: updatedText(changed) })
      timer.current = setTimeout(() => setState(idle), toastMs)
    } catch (error) {
      setState({ ...idle, error: errorMessage(error) })
    }
  }

  return {
    ...state,
    shift: (phase, days) => void run(() => shiftPhase(client, phase, days)),
    recalculate: () => void run(),
  }
}
