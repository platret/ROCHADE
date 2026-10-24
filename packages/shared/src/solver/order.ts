import type { Household } from '../types'

export const comparePlain = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0)

export const compareText = (a: string, b: string) => comparePlain(a.toLowerCase(), b.toLowerCase()) || comparePlain(a, b)

export const compareHouseholds = (a: Household, b: Household) => compareText(a.name, b.name) || comparePlain(a.id, b.id)
