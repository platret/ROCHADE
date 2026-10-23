import { assignmentStatuses, type AssignmentStatus } from '@rochade/shared'
import { Badge } from './Badge'

const chipText: Record<AssignmentStatus, (count: number) => string> = {
  ok: (count) => `${count} zugeteilt`,
  conflict: (count) => `${count} ${count === 1 ? 'Konflikt' : 'Konflikte'}`,
  open: (count) => `${count} offen`,
}

export const SummaryChips = ({ counts }: { counts: Record<AssignmentStatus, number> }) => (
  <ul className="flex flex-wrap gap-2" aria-label="Zusammenfassung">
    {assignmentStatuses.map((status) => (
      <li key={status}>
        <Badge status={status}>{chipText[status](counts[status])}</Badge>
      </li>
    ))}
  </ul>
)
