import { daysBetween } from '../format/date'
import type { Flat, Household, ISODate, Period } from '../types'

const districtBonus = 10
const conflictPenalty = 1_000_000
const delayPenaltyPerDay = 1_000

export const softScore = (household: Household, flat: Flat) => {
  const sameDistrict = Boolean(household.school_district) && household.school_district === flat.school_district
  const spareRooms = (flat.rooms - household.needs_rooms) * 2
  const wastedStepFree = flat.step_free && !household.needs_step_free ? 3 : 0
  return (sameDistrict ? districtBonus : 0) - spareRooms - wastedStepFree
}

export const conflictCost = (period: Period, latestMoveOut: ISODate) =>
  conflictPenalty + delayPenaltyPerDay * daysBetween(period.start, latestMoveOut)
