import type { AssignmentStatus } from '@rochade/shared'
import type { ReactNode } from 'react'

const statusClasses: Record<AssignmentStatus, string> = {
  ok: 'bg-success-soft text-success',
  conflict: 'bg-danger-soft text-danger',
  open: 'bg-surface-sunken text-ink-muted',
}

type Props = { status: AssignmentStatus; children: ReactNode }

export const Badge = ({ status, children }: Props) => (
  <span className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-label ${statusClasses[status]}`}>
    {children}
  </span>
)
