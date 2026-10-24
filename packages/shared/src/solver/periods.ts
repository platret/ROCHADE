import { periodsOverlap } from '../format/date'
import type { Flat, Household, ISODate, Period, Phase } from '../types'
import { comparePlain } from './order'

const comparePhases = (a: Phase, b: Phase) => comparePlain(a.start_date, b.start_date) || comparePlain(a.id, b.id)

export const buildingPeriods = (phases: Phase[], building: string): Period[] =>
  phases
    .filter((phase) => phase.building === building)
    .sort(comparePhases)
    .map((phase) => ({ start: phase.start_date, end: phase.end_date }))

export const householdPeriod = (household: Household, flats: Flat[], phases: Phase[]) => {
  const home = flats.find((flat) => flat.id === household.home_flat_id)
  return home ? (buildingPeriods(phases, home.building)[0] ?? null) : null
}

export const isUnderRenovation = (flat: Flat, period: Period, phases: Phase[]) =>
  buildingPeriods(phases, flat.building).some((renovation) => periodsOverlap(renovation, period))

export const latestMoveOut = (periods: Period[]): ISODate =>
  periods.reduce((latest, period) => (period.start > latest ? period.start : latest), '')
