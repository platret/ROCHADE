import { daysBetween, periodLengthDays, type Flat, type Household, type ISODate, type Phase } from '@rochade/shared'
import type { ChipProps } from '@/ui/Chip'

export type PhaseStatus = 'geplant' | 'laeuft' | 'abgeschlossen'

export const phaseChips: Record<PhaseStatus, ChipProps> = {
  geplant: { label: 'geplant' },
  laeuft: { label: 'läuft', tone: 'accent', dot: 'orange' },
  abgeschlossen: { label: 'abgeschlossen', symbol: 'checkmark' },
}

export const phaseStatus = (phase: Phase, today: ISODate): PhaseStatus =>
  today < phase.start_date ? 'geplant' : today > phase.end_date ? 'abgeschlossen' : 'laeuft'

export const runningPhase = (phases: Phase[], today: ISODate) =>
  phases.find((phase) => phaseStatus(phase, today) === 'laeuft') ?? null

export const sortedPhases = (phases: Phase[]) => [...phases].sort((a, b) => a.sort_order - b.sort_order)

const phasePeriod = (phase: Phase) => ({ start: phase.start_date, end: phase.end_date })

export const phaseProgress = (phase: Phase, today: ISODate) =>
  Math.min(1, Math.max(0, daysBetween(phase.start_date, today) / periodLengthDays(phasePeriod(phase))))

const daysPerMonth = 30.4

export const phaseDuration = (phase: Phase) => {
  const days = periodLengthDays(phasePeriod(phase))
  const months = Math.round(days / daysPerMonth)
  if (months < 1) return days === 1 ? '1 Tag' : `${days} Tage`
  return months === 1 ? '1 Monat' : `${months} Monate`
}

export const householdCountLabel = (count: number) => (count === 1 ? '1 Haushalt' : `${count} Haushalte`)

export const phaseCountLabel = (count: number) => (count === 1 ? '1 Etappe' : `${count} Etappen`)

export const householdCountByBuilding = (households: Household[], flats: Flat[]) => {
  const buildingByFlat = new Map(flats.map((flat) => [flat.id, flat.building]))
  const counts = new Map<string, number>()
  for (const household of households) {
    const building = household.home_flat_id ? buildingByFlat.get(household.home_flat_id) : undefined
    if (building) counts.set(building, (counts.get(building) ?? 0) + 1)
  }
  return counts
}
