import { formatFloor, formatPeriod, type Flat, type Phase, type Project, type ProjectData } from '@rochade/shared'
import type { SFSymbol } from 'expo-symbols'
import type { ReactNode } from 'react'
import { selectHousehold } from '@/data/selectors'
import { flatPlace } from '@/features/umzug/stepContent'
import { splitFlatLabel } from '@/lib/flats'
import type { Identity } from '@/lib/identity'
import { householdCountLabel, phaseCountLabel } from '@/lib/phases'
import { Text } from '@/ui/Text'

export type Fact = { symbol: SFSymbol; label: string; value: ReactNode; spoken: string; detail?: string }

export type Welcome = { title: string; intro?: string; facts: Fact[]; note?: string; confirmLabel: string }

const joined = (...parts: string[]) => ({ value: parts.join(' · '), spoken: parts.join(', ') })

const membersLabel = (members: number) => (members === 1 ? '1 Person' : `${members} Personen`)

const phasePeriod = (phase: Phase) => formatPeriod({ start: phase.start_date, end: phase.end_date })

const projectPeriod = (phases: Phase[]) => {
  const start = phases.map((phase) => phase.start_date).sort()[0]
  const end = phases.map((phase) => phase.end_date).sort().at(-1)
  return start && end ? formatPeriod({ start, end }) : undefined
}

const siedlungFact = (project: Project): Fact => ({ symbol: 'building.2', label: 'Siedlung', ...joined(project.name, project.city) })

const flatFact = (flat: Flat | null): Fact => {
  if (!flat) return { symbol: 'house', label: 'Wohnung', ...joined('Ohne eigene Wohnung') }
  const { prefix, number } = splitFlatLabel(flat.label)
  return {
    symbol: 'house',
    label: 'Wohnung',
    value: (
      <>
        {prefix}
        <Text variant="mono">{number}</Text>
        {` · ${flatPlace(flat)}`}
      </>
    ),
    spoken: joined(`Wohnung ${number}`, flat.building, formatFloor(flat.floor)).spoken,
  }
}

const phaseFact = (phase: Phase | null): Fact => ({
  symbol: 'calendar',
  label: 'Deine Etappe',
  ...(phase ? { ...joined(phase.name), detail: phasePeriod(phase) } : joined('Noch nicht geplant')),
})

const householdWelcome = (data: ProjectData, householdId: string): Welcome | null => {
  const mine = selectHousehold(data, householdId)
  if (!mine) return null
  const { household, homeFlat, phase } = mine
  return {
    title: `Willkommen, ${household.name}`,
    intro: 'Bitte prüfe kurz, ob das dein Haushalt ist.',
    facts: [
      { symbol: 'person.2', label: 'Haushalt', ...joined(household.name, membersLabel(household.members)) },
      flatFact(homeFlat),
      siedlungFact(data.project),
      phaseFact(phase),
    ],
    confirmLabel: 'Stimmt, weiter',
  }
}

const verwaltungWelcome = ({ project, phases, households }: ProjectData): Welcome => ({
  title: 'Willkommen, Verwaltung',
  facts: [
    siedlungFact(project),
    { symbol: 'calendar', label: 'Etappen', ...joined(phaseCountLabel(phases.length)), detail: projectPeriod(phases) },
    { symbol: 'person.3', label: 'Haushalte', ...joined(householdCountLabel(households.length)) },
  ],
  note: 'Die Planung führst du im Web. In der App siehst du die Übersicht.',
  confirmLabel: 'Übersicht öffnen',
})

export const welcomeFor = (data: ProjectData, identity: Identity) =>
  identity.kind === 'verwaltung' ? verwaltungWelcome(data) : householdWelcome(data, identity.householdId)
