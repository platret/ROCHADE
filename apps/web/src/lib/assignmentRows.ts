import type { Assignment, AssignmentStatus, Flat, Household, Phase, ProjectData, UUID } from '@rochade/shared'

export type AssignmentRow = {
  household: Household
  home: Flat | null
  assignment: Assignment | null
  temp: Flat | null
}

const lastRank = Number.MAX_SAFE_INTEGER

const buildingRanks = (phases: Phase[]) => {
  const ranks = new Map<string, number>()
  for (const phase of phases) {
    ranks.set(phase.building, Math.min(ranks.get(phase.building) ?? lastRank, phase.sort_order))
  }
  return ranks
}

const compareNames = (a: AssignmentRow, b: AssignmentRow) => a.household.name.localeCompare(b.household.name, 'de')

export const assignmentRows = ({ phases, flats, households, assignments }: ProjectData): AssignmentRow[] => {
  const flatById = new Map(flats.map((flat) => [flat.id, flat]))
  const assignmentByHousehold = new Map(assignments.map((assignment) => [assignment.household_id, assignment]))
  const ranks = buildingRanks(phases)
  const flatFor = (id: UUID | null | undefined) => (id ? (flatById.get(id) ?? null) : null)
  const rank = ({ home }: AssignmentRow) => (home ? ranks.get(home.building) : undefined) ?? lastRank

  return households
    .map((household) => {
      const assignment = assignmentByHousehold.get(household.id) ?? null
      return { household, home: flatFor(household.home_flat_id), assignment, temp: flatFor(assignment?.temp_flat_id) }
    })
    .sort((a, b) => rank(a) - rank(b) || compareNames(a, b))
}

export const statusCounts = (rows: AssignmentRow[]) => {
  const counts: Record<AssignmentStatus, number> = { ok: 0, conflict: 0, open: 0 }
  for (const row of rows) counts[row.assignment?.status ?? 'open'] += 1
  return counts
}
