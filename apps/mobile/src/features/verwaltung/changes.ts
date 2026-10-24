import type { AssignmentChange } from '@/data/assignmentChanges'

const changeCountLabel = (count: number) => (count === 1 ? '1 Änderung' : `${count} Änderungen`)

export const bannerTitle = (count: number) => `Plan aktualisiert · ${changeCountLabel(count)}`

export const affectedHouseholdIds = (changes: AssignmentChange[]) => [...new Set(changes.map((change) => change.householdId))]

export const latestChangeByHousehold = (changes: AssignmentChange[]): ReadonlyMap<string, number> => {
  const latest = new Map<string, number>()
  for (const change of changes) {
    const at = change.at.getTime()
    if (at > (latest.get(change.householdId) ?? 0)) latest.set(change.householdId, at)
  }
  return latest
}
