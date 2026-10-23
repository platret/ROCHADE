import { TriangleAlert } from 'lucide-react'
import type { PlanActions } from '../hooks/usePlan'

type Props = Pick<PlanActions, 'busy' | 'toast' | 'error'>

export const PlanStatus = ({ busy, toast, error }: Props) => {
  if (error) {
    return (
      <p className="flex min-h-5 items-center gap-2 text-body-sm text-danger" role="alert">
        <TriangleAlert size={16} className="shrink-0" />
        {error}
      </p>
    )
  }
  return (
    <p className="min-h-5 text-body-sm text-ink-muted" role="status">
      {busy ? 'Plan wird berechnet…' : toast}
    </p>
  )
}
