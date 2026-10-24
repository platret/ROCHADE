import { periodLengthDays } from '../format/date'
import type { Flat, Household, Period, Phase } from '../types'
import { candidateFlats, type Candidate } from './candidates'
import { compareHouseholds, comparePlain } from './order'
import { householdPeriod, latestMoveOut } from './periods'
import { conflictCost } from './scoring'

export type Task = { household: Household; period: Period; candidates: Candidate[]; unassignedCost: number }

type Draft = Omit<Task, 'unassignedCost'>

const compareTasks = (a: Task, b: Task) =>
  a.candidates.length - b.candidates.length ||
  periodLengthDays(b.period) - periodLengthDays(a.period) ||
  comparePlain(a.period.start, b.period.start) ||
  compareHouseholds(a.household, b.household)

const draftFor = (household: Household, flats: Flat[], phases: Phase[]): Draft[] => {
  const period = householdPeriod(household, flats, phases)
  return period ? [{ household, period, candidates: candidateFlats(household, period, flats, phases) }] : []
}

export const buildTasks = (households: Household[], flats: Flat[], phases: Phase[]): Task[] => {
  const drafts = households.flatMap((household) => draftFor(household, flats, phases))
  const latest = latestMoveOut(drafts.map((draft) => draft.period))
  return drafts.map((draft) => ({ ...draft, unassignedCost: conflictCost(draft.period, latest) })).sort(compareTasks)
}
