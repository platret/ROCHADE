import { daysBetween, formatDate, type Assignment, type ISODate, type Phase } from '@rochade/shared'
import type { SFSymbol } from 'expo-symbols'
import { phaseStatus } from '@/lib/phases'

export type MoveFact = { symbol: SFSymbol; before: string; date: ISODate; after: string }

const runningSince = (days: number) =>
  days === 0 ? 'Läuft seit heute' : days === 1 ? 'Läuft seit gestern' : `Läuft seit ${days} Tagen`

const remaining = (days: number) => (days === 0 ? 'endet heute' : days === 1 ? 'noch 1 Tag' : `noch ${days} Tage`)

export const etappeStatusParts = (phase: Phase, today: ISODate): string[] => {
  const status = phaseStatus(phase, today)
  if (status === 'abgeschlossen') return ['Abgeschlossen']
  if (status === 'geplant') {
    const days = daysBetween(today, phase.start_date)
    return [days === 1 ? 'Beginnt morgen' : `Beginnt in ${days} Tagen`]
  }
  return [runningSince(daysBetween(phase.start_date, today)), remaining(daysBetween(today, phase.end_date))]
}

export const nextPhase = (phases: Phase[], today: ISODate): Phase | null =>
  phases.filter((phase) => phase.start_date > today).sort((a, b) => a.start_date.localeCompare(b.start_date))[0] ?? null

const moveOutFact = (date: ISODate, today: ISODate): MoveFact =>
  today <= date
    ? { symbol: 'door.left.hand.open', before: 'Du ziehst am ', date, after: ' aus' }
    : { symbol: 'door.left.hand.open', before: 'Auszug am ', date, after: '' }

export const moveFacts = (assignment: Assignment | null, today: ISODate): MoveFact[] => {
  const facts: MoveFact[] = []
  if (assignment?.move_out) facts.push(moveOutFact(assignment.move_out, today))
  if (assignment?.move_back) facts.push({ symbol: 'house', before: 'Rückkehr am ', date: assignment.move_back, after: '' })
  return facts
}

export const movesFallback = 'Termine folgen'

export const movesText = (moves: MoveFact[]) =>
  moves.length === 0 ? movesFallback : moves.map(({ before, date, after }) => `${before}${formatDate(date)}${after}`).join('. ')
