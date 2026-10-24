import type { Flat, Household } from '../types'
import { compareHouseholds } from './order'
import { conflictReason } from './reasons'
import { search } from './search'
import { buildTasks, type Task } from './tasks'
import type { Conflict, PlannedAssignment, SolveInput, SolveResult } from './types'

type Placement = { task: Task; flat: Flat | null }

const openAssignment = (household: Household): PlannedAssignment => ({
  household_id: household.id,
  temp_flat_id: null,
  move_out: null,
  move_back: null,
  status: 'open',
  conflict_reason: null,
})

const plannedAssignment = ({ task: { household, period }, flat }: Placement): PlannedAssignment => ({
  household_id: household.id,
  temp_flat_id: flat?.id ?? null,
  move_out: period.start,
  move_back: period.end,
  status: flat ? 'ok' : 'conflict',
  conflict_reason: flat ? null : conflictReason(household, period),
})

const toConflict = ({ household, period }: Task): Conflict => ({
  household_id: household.id,
  period,
  needs_rooms: household.needs_rooms,
  needs_step_free: household.needs_step_free,
  reason: conflictReason(household, period),
})

export const solve = ({ phases, flats, households }: SolveInput): SolveResult => {
  const tasks = buildTasks(households, flats, phases)
  const chosen = search(tasks)
  const placements = new Map(tasks.map((task, index): [string, Placement] => [task.household.id, { task, flat: chosen[index] ?? null }]))
  const ordered = [...households].sort(compareHouseholds)
  const assignments = ordered.map((household) => {
    const placement = placements.get(household.id)
    return placement ? plannedAssignment(placement) : openAssignment(household)
  })
  const conflicts = ordered.flatMap((household) => {
    const placement = placements.get(household.id)
    return placement && !placement.flat ? [toConflict(placement.task)] : []
  })
  return { assignments, conflicts }
}
