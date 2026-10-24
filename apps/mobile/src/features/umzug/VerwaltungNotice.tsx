import type { AssignmentStatus, ProjectData } from '@rochade/shared'
import { EmptyState } from '@/ui/EmptyState'

export type VerwaltungNoticeProps = { data: ProjectData; onSwitch: () => void }

const planSummary = ({ households, assignments }: ProjectData) => {
  const count = (status: AssignmentStatus) => assignments.filter((assignment) => assignment.status === status).length
  const ok = count('ok')
  const conflicts = count('conflict')
  const open = Math.max(0, households.length - ok - conflicts)
  return `${ok} zugeteilt · ${conflicts} ${conflicts === 1 ? 'Konflikt' : 'Konflikte'} · ${open} offen`
}

export const VerwaltungNotice = ({ data, onSwitch }: VerwaltungNoticeProps) => (
  <EmptyState
    symbol="building.2"
    title="Nur Ansicht"
    body="Die Verwaltung hat keinen eigenen Umzug. Die Übersicht aller Haushalte und Etappen steht im Tab «Siedlung»."
    detail={planSummary(data)}
    action={{ label: 'Haushalt wechseln', onPress: onSwitch, variant: 'secondary' }}
  />
)
