import { formatDate, spacing, todayIso, type ISODate, type Phase } from '@rochade/shared'
import { View } from 'react-native'
import { phaseChips, phaseCountLabel, phaseStatus, sortedPhases } from '@/lib/phases'
import { Chip } from '@/ui/Chip'
import { ListGroup } from '@/ui/ListGroup'
import { ListRow } from '@/ui/ListRow'
import { SectionHeader } from '@/ui/SectionHeader'
import { Text } from '@/ui/Text'
import { Mono } from './inlineFacts'

export type PhaseListProps = { phases: Phase[] }

const PhaseRow = ({ phase, today }: { phase: Phase; today: ISODate }) => {
  const chip = phaseChips[phaseStatus(phase, today)]
  const dates = `${formatDate(phase.start_date)} bis ${formatDate(phase.end_date)}`
  return (
    <ListRow
      title={phase.name}
      accessibilityLabel={`${phase.name}, ${phase.building}, ${chip.label}, ${dates}`}
      subtitle={
        <>
          {`${phase.building} · `}
          <Mono>{formatDate(phase.start_date)}</Mono>
          {' bis '}
          <Mono>{formatDate(phase.end_date)}</Mono>
        </>
      }
      trailing={<Chip {...chip} />}
    />
  )
}

export const PhaseList = ({ phases }: PhaseListProps) => {
  const today = todayIso()
  const sorted = sortedPhases(phases)
  return (
    <View style={{ gap: spacing.md }}>
      <SectionHeader title="Bauetappen" meta={phaseCountLabel(sorted.length)} />
      {sorted.length === 0 ? (
        <Text variant="bodySm" color="inkMuted">
          Noch keine Bauetappen veröffentlicht.
        </Text>
      ) : (
        <ListGroup dividerInset={spacing.lg}>
          {sorted.map((phase) => (
            <PhaseRow key={phase.id} phase={phase} today={today} />
          ))}
        </ListGroup>
      )}
    </View>
  )
}
