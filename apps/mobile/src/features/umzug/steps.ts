import { daysBetween, type Assignment, type ISODate } from '@rochade/shared'

export type NodeState = 'done' | 'current' | 'future' | 'conflict'

export const stepCount = 3

export const currentStep = ({ move_out, move_back }: Assignment, today: ISODate) =>
  move_out === null || today <= move_out ? 0 : move_back === null || today < move_back ? 1 : 2

export const nodeState = (index: number, current: number, conflict: boolean): NodeState => {
  if (conflict && index === 1) return 'conflict'
  if (index < current) return 'done'
  return index === current ? 'current' : 'future'
}

export const countdown = (today: ISODate, date: ISODate) => {
  const days = daysBetween(today, date)
  if (days === 0) return 'Heute'
  if (days === 1) return 'Morgen'
  if (days === -1) return 'Gestern'
  return days > 0 ? `In ${days} Tagen` : `Vor ${-days} Tagen`
}
