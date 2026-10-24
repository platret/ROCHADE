import { formatFloor, formatPeriod, type Flat, type Phase, type Project } from '@rochade/shared'
import type { ReactNode } from 'react'
import { periodRange } from '@/features/verwaltung/rowText'
import { splitFlatLabel } from '@/lib/flats'
import { Text } from '@/ui/Text'

export type Fact = { value: ReactNode; spoken: string; muted?: boolean; detail?: string }

export const pending = 'Noch offen'

export const placeOf = (project: Project) => `${project.name}, ${project.city}`

export const textFact = (text: string): Fact => ({ value: text, spoken: text })

const emptyFact = (text: string): Fact => ({ value: text, spoken: text, muted: true })

export const membersFact = (members: number) => textFact(members === 1 ? '1 Person' : `${members} Personen`)

export const flatFact = (flat: Flat | null, empty: string, withFloor = false): Fact => {
  if (!flat) return emptyFact(empty)
  const { prefix, number } = splitFlatLabel(flat.label)
  const place = withFloor ? [flat.building, formatFloor(flat.floor)] : [flat.building]
  return {
    value: (
      <>
        {prefix}
        <Text variant="mono">{number}</Text>
        {place.map((part) => ` · ${part}`).join('')}
      </>
    ),
    spoken: [`Wohnung ${number}`, ...place].join(', '),
  }
}

export const phaseFact = (phase: Phase | null): Fact => {
  if (!phase) return emptyFact(pending)
  const period = { start: phase.start_date, end: phase.end_date }
  return { value: phase.name, spoken: `${phase.name}, vom ${formatPeriod(period)}`, detail: periodRange(period) }
}
