import type { Assignment } from '@rochade/shared'
import { ChecklistCard } from './ChecklistCard'
import { checklistItems } from './items'

export type ChecklistProps = { householdId: string; assignment: Assignment }

export const Checklist = ({ householdId, assignment }: ChecklistProps) => {
  const items = checklistItems(assignment)
  if (items.length === 0) return null
  return <ChecklistCard key={householdId} householdId={householdId} items={items} />
}
