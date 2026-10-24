import { formatPeriod } from '../format/date'
import { dativeName, formatRooms } from '../format/names'
import type { Household, Period } from '../types'

export const conflictReason = (household: Household, period: Period) => {
  const stepFree = household.needs_step_free ? 'hindernisfreie ' : ''
  return `Für ${dativeName(household.name)} fehlt vom ${formatPeriod(period)} eine ${stepFree}${formatRooms(household.needs_rooms)}-Wohnung.`
}
