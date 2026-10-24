import type { Flat, Household, Period, Phase } from '../types'
import { comparePlain, compareText } from './order'
import { isUnderRenovation } from './periods'
import { softScore } from './scoring'

export type Candidate = { flat: Flat; score: number }

const compareCandidates = (a: Candidate, b: Candidate) =>
  b.score - a.score || compareText(a.flat.label, b.flat.label) || comparePlain(a.flat.id, b.flat.id)

const suits = (flat: Flat, household: Household) =>
  flat.is_temporary &&
  flat.id !== household.home_flat_id &&
  flat.rooms >= household.needs_rooms &&
  (flat.step_free || !household.needs_step_free)

export const candidateFlats = (household: Household, period: Period, flats: Flat[], phases: Phase[]): Candidate[] =>
  flats
    .filter((flat) => suits(flat, household) && !isUnderRenovation(flat, period, phases))
    .map((flat) => ({ flat, score: softScore(household, flat) }))
    .sort(compareCandidates)
