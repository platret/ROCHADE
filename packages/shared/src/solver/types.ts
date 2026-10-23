import type { Assignment, Flat, Household, Period, Phase, UUID } from '../types'

export type SolveInput = {
  phases: Phase[]
  flats: Flat[]
  households: Household[]
}

export type PlannedAssignment = Pick<Assignment, 'household_id' | 'temp_flat_id' | 'move_out' | 'move_back' | 'status' | 'conflict_reason'>

export type Conflict = {
  household_id: UUID
  period: Period
  needs_rooms: number
  needs_step_free: boolean
  reason: string
}

export type SolveResult = {
  assignments: PlannedAssignment[]
  conflicts: Conflict[]
}
