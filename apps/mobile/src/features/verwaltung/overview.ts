import type { Assignment, AssignmentStatus, Flat, Household, Period, Phase, ProjectData } from '@rochade/shared'

export type OverviewRow = {
  household: Household
  homeFlat: Flat | null
  tempFlat: Flat | null
  status: AssignmentStatus
  period: Period | null
  reason: string | null
}

export type StatusCounts = Record<AssignmentStatus, number>

const lastPlace = Number.MAX_SAFE_INTEGER

const phaseOrderByBuilding = (phases: Phase[]) => {
  const order = new Map<string, number>()
  for (const phase of phases) order.set(phase.building, Math.min(order.get(phase.building) ?? lastPlace, phase.sort_order))
  return order
}

const periodOf = (assignment: Assignment | undefined): Period | null =>
  assignment?.move_out && assignment.move_back ? { start: assignment.move_out, end: assignment.move_back } : null

export const overviewRows = ({ households, flats, assignments, phases }: ProjectData): OverviewRow[] => {
  const flatById = new Map(flats.map((flat) => [flat.id, flat]))
  const assignmentByHousehold = new Map(assignments.map((assignment) => [assignment.household_id, assignment]))
  const order = phaseOrderByBuilding(phases)
  const flatOf = (id: string | null | undefined) => (id ? (flatById.get(id) ?? null) : null)
  const placeOf = (flat: Flat | null) => (flat ? (order.get(flat.building) ?? lastPlace) : lastPlace)
  return households
    .map((household): OverviewRow => {
      const assignment = assignmentByHousehold.get(household.id)
      return {
        household,
        homeFlat: flatOf(household.home_flat_id),
        tempFlat: flatOf(assignment?.temp_flat_id),
        status: assignment?.status ?? 'open',
        period: periodOf(assignment),
        reason: assignment?.conflict_reason ?? null,
      }
    })
    .sort((a, b) => placeOf(a.homeFlat) - placeOf(b.homeFlat) || a.household.name.localeCompare(b.household.name, 'de'))
}

export const statusCounts = (rows: OverviewRow[]): StatusCounts => {
  const counts: StatusCounts = { ok: 0, conflict: 0, open: 0 }
  for (const row of rows) counts[row.status] += 1
  return counts
}
