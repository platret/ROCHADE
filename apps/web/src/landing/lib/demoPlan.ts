import {
  addDays,
  demoFlats,
  demoHouseholds,
  demoProject,
  solve,
  type Assignment,
  type Phase,
  type PlannedAssignment,
  type ProjectData,
  type UUID,
} from '@rochade/shared'

const stamp = demoProject.created_at

const toAssignment = (planned: PlannedAssignment, index: number): Assignment => ({
  ...planned,
  id: `demo-assignment-${index + 1}`,
  project_id: demoProject.id,
  created_at: stamp,
  updated_at: stamp,
})

export const demoProjectData = (phases: Phase[]): ProjectData => ({
  project: demoProject,
  phases,
  flats: demoFlats,
  households: demoHouseholds,
  assignments: solve({ phases, flats: demoFlats, households: demoHouseholds }).assignments.map(toAssignment),
})

export const shiftPhases = (phases: Phase[], phaseId: UUID, days: number) =>
  phases.map((phase) =>
    phase.id === phaseId ? { ...phase, start_date: addDays(phase.start_date, days), end_date: addDays(phase.end_date, days) } : phase,
  )

const signature = ({ household_id, temp_flat_id, move_out, move_back, status }: Assignment) =>
  [household_id, temp_flat_id, move_out, move_back, status].join(':')

export const countChanges = (before: Assignment[], after: Assignment[]) => {
  const seen = new Set(before.map(signature))
  return after.filter((assignment) => !seen.has(signature(assignment))).length
}
