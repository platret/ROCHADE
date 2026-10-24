import { demoFlats, demoHouseholds, demoPhases, solve, type Assignment, type Flat, type Household } from '@rochade/shared'

export type PlanStats = { households: number; rochadeFlats: number; conflicts: number }

type StatsInput = { households: Household[]; flats: Flat[]; assignments: Pick<Assignment, 'status'>[] }

export const planStats = ({ households, flats, assignments }: StatsInput): PlanStats => ({
  households: households.length,
  rochadeFlats: flats.filter((flat) => flat.is_temporary).length,
  conflicts: assignments.filter((assignment) => assignment.status === 'conflict').length,
})

export const demoStats = planStats({
  households: demoHouseholds,
  flats: demoFlats,
  assignments: solve({ phases: demoPhases, flats: demoFlats, households: demoHouseholds }).assignments,
})
