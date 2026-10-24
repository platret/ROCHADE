import { formatDate, radius, spacing, toIsoDate, type ColorName, type ISODate, type Phase } from '@rochade/shared'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'
import { householdCountLabel, phaseChips, phaseDuration, phaseProgress, phaseStatus, type PhaseStatus } from '@/lib/phases'
import { useTheme } from '@/theme/useTheme'
import { Card } from '@/ui/Card'
import { Chip } from '@/ui/Chip'
import { Icon } from '@/ui/Icon'
import { Text } from '@/ui/Text'
import { PhaseDates } from './PhaseDates'
import type { PhaseChange } from './usePhaseChanges'
import { usePulse } from './usePulse'
import { useReveal } from './useReveal'

export type PhaseCardProps = { phase: Phase; householdCount: number; today: ISODate; change?: PhaseChange }

const accentWidth = 3
const progressHeight = 4

const phaseAccents: Record<PhaseStatus, ColorName> = { geplant: 'slate', laeuft: 'orangeStrong', abgeschlossen: 'success' }

const ProgressBar = ({ fraction }: { fraction: number }) => {
  const { colors } = useTheme()
  const fillStyle = useReveal(true, 0, fraction)
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(fraction * 100) }}
      style={{ height: progressHeight, borderRadius: progressHeight / 2, marginTop: spacing.md, backgroundColor: colors.line, overflow: 'hidden' }}
    >
      <Animated.View style={[{ height: progressHeight, backgroundColor: colors.orangeStrong }, fillStyle]} />
    </View>
  )
}

export const PhaseCard = ({ phase, householdCount, today, change }: PhaseCardProps) => {
  const { colors } = useTheme()
  const pulse = usePulse(change?.at.getTime() ?? null)
  const status = phaseStatus(phase, today)
  const chip = phaseChips[status]
  const duration = phaseDuration(phase)
  const households = householdCountLabel(householdCount)
  const changedOn = change?.changedAt ? formatDate(toIsoDate(change.changedAt)) : null
  const dates = `Beginn ${formatDate(phase.start_date)}, Ende ${formatDate(phase.end_date)}`
  const summary = `${phase.name}, ${phase.building}, ${chip.label}. ${dates}. ${duration}, ${households}.${changedOn ? ` Geändert am ${changedOn}.` : ''}`
  return (
    <Animated.View style={[{ borderRadius: radius.md }, pulse]}>
      <Card accessible accessibilityLabel={summary} style={{ backgroundColor: 'transparent', overflow: 'hidden' }}>
        <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: accentWidth, backgroundColor: colors[phaseAccents[status]] }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
          <Text variant="h3" numberOfLines={1} style={{ flexShrink: 1 }}>
            {phase.name}
          </Text>
          <Chip {...chip} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs }}>
          <Icon name="building.2" size={16} color="inkMuted" />
          <Text variant="bodySm" color="inkMuted">
            {phase.building}
          </Text>
        </View>
        <View style={{ marginTop: spacing.md }}>
          <PhaseDates start={phase.start_date} end={phase.end_date} previousStart={change?.start_date} previousEnd={change?.end_date} />
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }}>
          <Chip label={duration} symbol="clock" />
          <Chip label={households} symbol="person.2" />
        </View>
        {changedOn && (
          <Text variant="label" weight={400} color="inkMuted" style={{ marginTop: spacing.sm }}>
            {'Geändert am '}
            <Text variant="monoSm" color="inkMuted" style={{ fontSize: 13 }}>
              {changedOn}
            </Text>
          </Text>
        )}
        {status === 'laeuft' && <ProgressBar fraction={phaseProgress(phase, today)} />}
      </Card>
    </Animated.View>
  )
}
