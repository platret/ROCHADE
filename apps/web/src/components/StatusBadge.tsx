import { statusLabels, type AssignmentStatus } from '@rochade/shared'
import { Circle, CircleCheck, TriangleAlert, type LucideIcon } from 'lucide-react'
import { Badge } from './Badge'

const icons: Record<AssignmentStatus, LucideIcon> = { ok: CircleCheck, conflict: TriangleAlert, open: Circle }

export const StatusBadge = ({ status }: { status: AssignmentStatus }) => {
  const Icon = icons[status]
  return (
    <Badge status={status}>
      <Icon size={14} />
      {statusLabels[status]}
    </Badge>
  )
}
