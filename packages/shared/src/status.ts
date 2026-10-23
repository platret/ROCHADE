import type { AssignmentStatus } from './types'

export const statusLabels: Record<AssignmentStatus, string> = {
  ok: 'Zugeteilt',
  conflict: 'Konflikt',
  open: 'Offen',
}

export const reassurance = 'Die Verwaltung arbeitet an einer Lösung.'
export const planUpdatedTitle = 'Dein Plan wurde aktualisiert'
