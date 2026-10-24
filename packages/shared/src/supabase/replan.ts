import { solve } from '../solver/solve'
import type { PlannedAssignment, SolveResult } from '../solver/types'
import type { Assignment, UUID } from '../types'
import type { RochadeClient } from './client'
import { fetchProjectData, unwrap } from './queries'

const plannedKeys = ['temp_flat_id', 'move_out', 'move_back', 'status', 'conflict_reason'] as const

const differs = (planned: PlannedAssignment, existing: Assignment | undefined) =>
  !existing || plannedKeys.some((key) => planned[key] !== existing[key])

export const replan = async (client: RochadeClient, projectId: UUID): Promise<{ result: SolveResult; changed: number }> => {
  const { phases, flats, households, assignments: existing } = await fetchProjectData(client, projectId)
  const result = solve({ phases, flats, households })
  const byHousehold = new Map(existing.map((row) => [row.household_id, row]))
  const updated_at = new Date().toISOString()
  const rows = result.assignments
    .filter((planned) => differs(planned, byHousehold.get(planned.household_id)))
    .map((planned) => ({ ...planned, project_id: projectId, updated_at }))
  if (rows.length > 0) unwrap(await client.from('assignments').upsert(rows, { onConflict: 'household_id' }))
  return { result, changed: rows.length }
}
