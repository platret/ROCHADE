import type { Assignment } from '@rochade/shared'

export const changeFields = ['temp_flat_id', 'move_out', 'move_back', 'status', 'conflict_reason'] as const

export type ChangeField = (typeof changeFields)[number]

export type AssignmentChange = {
  householdId: string
  field: ChangeField
  from: string | null
  to: string | null
  at: Date
}

export const diffAssignments = (previous: Assignment[], next: Assignment[], at: Date): AssignmentChange[] => {
  const before = new Map(previous.map((assignment) => [assignment.household_id, assignment]))
  const changes: AssignmentChange[] = []
  for (const assignment of next) {
    const old = before.get(assignment.household_id)
    for (const field of changeFields) {
      const from = old?.[field] ?? null
      const to = assignment[field]
      if (from !== to) changes.push({ householdId: assignment.household_id, field, from, to, at })
    }
  }
  return changes
}
