import { spacing, type ISODate, type ProjectData } from '@rochade/shared'
import { View } from 'react-native'
import { householdCountByBuilding, phaseCountLabel, sortedPhases } from '@/lib/phases'
import { SectionHeader } from '@/ui/SectionHeader'
import { PhaseCard } from './PhaseCard'
import { usePhaseChanges } from './usePhaseChanges'

export type PhasesSectionProps = { data: ProjectData; today: ISODate; live: boolean }

export const PhasesSection = ({ data, today, live }: PhasesSectionProps) => {
  const phases = sortedPhases(data.phases)
  const counts = householdCountByBuilding(data.households, data.flats)
  const changes = usePhaseChanges(data.phases, live)
  return (
    <View style={{ gap: spacing.md }}>
      <SectionHeader title="Bauetappen" meta={phaseCountLabel(phases.length)} />
      {phases.map((phase) => (
        <PhaseCard
          key={phase.id}
          phase={phase}
          householdCount={counts.get(phase.building) ?? 0}
          today={today}
          change={changes.get(phase.id)}
        />
      ))}
    </View>
  )
}
