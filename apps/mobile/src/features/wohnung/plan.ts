import { daysBetween, type Flat, type ISODate } from '@rochade/shared'
import type { MyHousehold } from '@/data/selectors'

export type WohnungPlan = {
  householdId: string
  tempFlat: Flat
  homeFlat: Flat | null
  moveOut: ISODate | null
  moveBack: ISODate | null
}

export const planOf = ({ household, assignment, tempFlat, homeFlat }: MyHousehold): WohnungPlan | null =>
  tempFlat
    ? {
        householdId: household.id,
        tempFlat,
        homeFlat,
        moveOut: assignment?.move_out ?? null,
        moveBack: assignment?.move_back ?? null,
      }
    : null

export const stayDays = ({ moveOut, moveBack }: WohnungPlan) => (moveOut && moveBack ? daysBetween(moveOut, moveBack) : null)

export const formatDays = (days: number) => (days === 1 ? '1 Tag' : `${days} Tage`)
