import type { Household, HouseholdNeeds } from '@rochade/shared'

export type NeedsForm = { rooms: number; stepFree: boolean; schoolDistrict: string; note: string }

export const roomsRange = { min: 1, max: 6, step: 0.5 } as const
export const schoolDistrictMaxLength = 40
export const noteMaxLength = 500

export const clampRooms = (rooms: number) => Math.min(roomsRange.max, Math.max(roomsRange.min, rooms))

export const roomsLabel = (rooms: number) => `${rooms} Zimmer`

export const stepFreeLabel = (stepFree: boolean) => (stepFree ? 'Nötig' : 'Nicht nötig')

export const formFromHousehold = (household: Household): NeedsForm => ({
  rooms: clampRooms(household.needs_rooms),
  stepFree: household.needs_step_free,
  schoolDistrict: household.school_district ?? '',
  note: household.note ?? '',
})

const trimmedOrNull = (value: string) => {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export const needsFromForm = (form: NeedsForm): HouseholdNeeds => ({
  needs_rooms: form.rooms,
  needs_step_free: form.stepFree,
  school_district: trimmedOrNull(form.schoolDistrict),
  note: trimmedOrNull(form.note),
})

const sameNeeds = (a: HouseholdNeeds, b: HouseholdNeeds) =>
  a.needs_rooms === b.needs_rooms &&
  a.needs_step_free === b.needs_step_free &&
  a.school_district === b.school_district &&
  a.note === b.note

export const isDirty = (form: NeedsForm, initial: NeedsForm) => !sameNeeds(needsFromForm(form), needsFromForm(initial))
