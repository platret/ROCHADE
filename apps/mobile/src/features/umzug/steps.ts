import { daysBetween, type Assignment, type ISODate } from '@rochade/shared'

export type NodeState = 'done' | 'current' | 'future' | 'conflict'

export type Countdown = { word: string } | { prefix: string; days: number; suffix: string }

export const stepCount = 3
const soonDays = 60

export const currentStep = ({ move_out, move_back }: Assignment, today: ISODate) =>
  move_out === null || today <= move_out ? 0 : move_back === null || today < move_back ? 1 : 2

export const nextDateStep = (current: number) => (current === 0 ? 0 : current === 1 ? 2 : null)

export const nodeState = (index: number, current: number, conflict: boolean): NodeState => {
  if (conflict && index === 1) return 'conflict'
  if (index < current) return 'done'
  return index === current ? 'current' : 'future'
}

export const countdownParts = (today: ISODate, date: ISODate): Countdown => {
  const days = daysBetween(today, date)
  if (days === 0) return { word: 'Heute' }
  if (days === 1) return { word: 'Morgen' }
  if (days === -1) return { word: 'Gestern' }
  return days > 0 ? { prefix: 'In ', days, suffix: ' Tagen' } : { prefix: 'Vor ', days: -days, suffix: ' Tagen' }
}

export const countdown = (today: ISODate, date: ISODate) => {
  const parts = countdownParts(today, date)
  return 'word' in parts ? parts.word : `${parts.prefix}${parts.days}${parts.suffix}`
}

export const isSoon = (today: ISODate, date: ISODate) => {
  const days = daysBetween(today, date)
  return days >= 0 && days <= soonDays
}
