import type { Flat, Household } from '@rochade/shared'

export type HouseholdWithFlat = { household: Household; flat: Flat | null }

const afterEverything = '￿'

const compareByFlat = (a: HouseholdWithFlat, b: HouseholdWithFlat) =>
  (a.flat?.building ?? afterEverything).localeCompare(b.flat?.building ?? afterEverything, 'de') ||
  (a.flat?.label ?? '').localeCompare(b.flat?.label ?? '', 'de', { numeric: true }) ||
  a.household.name.localeCompare(b.household.name, 'de')

export const householdsByFlat = (households: Household[], flats: Flat[]): HouseholdWithFlat[] => {
  const flatById = new Map(flats.map((flat) => [flat.id, flat]))
  return households
    .map((household) => ({ household, flat: (household.home_flat_id && flatById.get(household.home_flat_id)) || null }))
    .sort(compareByFlat)
}
