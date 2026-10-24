import { statusLabels, type AssignmentStatus } from '@rochade/shared'
import { Circle, CircleCheck, TriangleAlert, type LucideIcon } from 'lucide-react'
import { cx } from '../lib/cx'
import { Badge } from './Badge'

const icons: Record<AssignmentStatus, LucideIcon> = { ok: CircleCheck, conflict: TriangleAlert, open: Circle }

type Props = { status: AssignmentStatus; compact?: boolean }

export const StatusBadge = ({ status, compact = false }: Props) => {
  const Icon = icons[status]
  return (
    <Badge status={status}>
      <Icon size={14} />
      <span className={cx(compact && 'sr-only min-[480px]:not-sr-only')}>{statusLabels[status]}</span>
    </Badge>
  )
}
