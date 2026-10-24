import { demoPhases, type Phase } from '@rochade/shared'
import { useEffect, useRef, useState } from 'react'
import { toastMs, updatedText, type PlanActions } from '../../hooks/usePlan'
import { countChanges, demoProjectData, shiftPhases } from '../lib/demoPlan'

export const useDemoPlan = () => {
  const [data, setData] = useState(() => demoProjectData(demoPhases))
  const [toast, setToast] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const apply = (phases: Phase[]) => {
    const next = demoProjectData(phases)
    setData(next)
    setToast(updatedText(countChanges(data.assignments, next.assignments)))
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), toastMs)
  }

  const plan: PlanActions = {
    busy: false,
    toast,
    error: null,
    shift: (phase, days) => apply(shiftPhases(data.phases, phase.id, days)),
    recalculate: () => apply(data.phases),
  }

  return { data, plan }
}
