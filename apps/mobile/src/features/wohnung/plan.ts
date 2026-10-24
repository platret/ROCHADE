import { daysBetween, type Flat, type ISODate } from '@rochade/shared'
import type { MyHousehold } from '@/data/selectors'

export type WohnungPlan = {
  householdId: string
  tempFlat: Flat
  homeFlat: Flat | null
  moveOut: ISODate | null
  moveBack: ISODate | null
}

export type StayProgress = { elapsed: number; total: number }

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

export const stayProgress = (plan: WohnungPlan, today: ISODate): StayProgress | null => {
  const total = stayDays(plan)
  if (total === null || total <= 0 || plan.moveOut === null || today < plan.moveOut) return null
  return { elapsed: Math.min(total, daysBetween(plan.moveOut, today)), total }
}

export const formatDays = (days: number) => (days === 1 ? '1 Tag' : `${days} Tage`)

export const formatStayProgress = ({ elapsed, total }: StayProgress) => `${elapsed} von ${total} Tagen vergangen`
