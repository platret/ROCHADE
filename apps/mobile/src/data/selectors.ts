import type { Assignment, Flat, Household, Phase, ProjectData } from '@rochade/shared'
import { useIdentity } from './IdentityProvider'
import { useProject } from './ProjectProvider'

export type MyHousehold = {
  household: Household
  homeFlat: Flat | null
  assignment: Assignment | null
  tempFlat: Flat | null
  phase: Phase | null
}

export const selectHousehold = (data: ProjectData, householdId: string): MyHousehold | null => {
  const { households, flats, assignments, phases } = data
  const household = households.find((candidate) => candidate.id === householdId)
  if (!household) return null
  const homeFlat = flats.find((flat) => flat.id === household.home_flat_id) ?? null
  const assignment = assignments.find((candidate) => candidate.household_id === household.id) ?? null
  const tempFlatId = assignment?.temp_flat_id ?? null
  const tempFlat = tempFlatId ? (flats.find((flat) => flat.id === tempFlatId) ?? null) : null
  const phase = homeFlat ? (phases.find((candidate) => candidate.building === homeFlat.building) ?? null) : null
  return { household, homeFlat, assignment, tempFlat, phase }
}

export const useMyHousehold = (): MyHousehold | null => {
  const { identity } = useIdentity()
  const project = useProject()
  if (identity?.kind !== 'household' || project.status !== 'ready') return null
  return selectHousehold(project.data, identity.householdId)
}
