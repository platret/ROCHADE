import { assignmentStatuses, type AssignmentStatus, type Flat } from '@rochade/shared'
import type { AssignmentChange, ChangeField } from '@/data/assignmentChanges'

export type FieldChange = { field: ChangeField; from: string | null; to: string | null }

export const changeFieldLabels: Record<ChangeField, string> = {
  move_out: 'Auszug',
  temp_flat_id: 'Rochade-Wohnung',
  move_back: 'Rückkehr',
  status: 'Status',
  conflict_reason: 'Grund',
}

const displayOrder = Object.keys(changeFieldLabels) as ChangeField[]

const latestChange = (changes: AssignmentChange[], field: ChangeField) => changes.find((change) => change.field === field)

export const summariseChanges = (changes: AssignmentChange[]): FieldChange[] =>
  displayOrder.flatMap((field) => {
    const latest = latestChange(changes, field)
    if (!latest || (field === 'conflict_reason' && latest.to === null)) return []
    return [{ field, from: latest.from, to: latest.to }]
  })

export const latestChangeAt = (changes: AssignmentChange[], field: ChangeField) => latestChange(changes, field)?.at ?? null

export const isAssignmentStatus = (value: string): value is AssignmentStatus =>
  (assignmentStatuses as readonly string[]).includes(value)

export const flatLabelFor = (flats: Flat[], flatId: string) => flats.find((flat) => flat.id === flatId)?.label ?? null
