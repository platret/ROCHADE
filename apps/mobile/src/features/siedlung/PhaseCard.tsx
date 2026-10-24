import { formatDate, radius, spacing, toIsoDate, type ISODate, type Phase } from '@rochade/shared'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'
import { householdCountLabel, phaseChips, phaseDuration, phaseProgress, phaseStatus } from '@/lib/phases'
import { useTheme } from '@/theme/useTheme'
import { Card } from '@/ui/Card'
import { Chip } from '@/ui/Chip'
import { Icon } from '@/ui/Icon'
import { Text } from '@/ui/Text'
import { PhaseDates } from './PhaseDates'
import type { PhaseChange } from './usePhaseChanges'
import { usePulse } from './usePulse'

export type PhaseCardProps = { phase: Phase; householdCount: number; today: ISODate; change?: PhaseChange }

const progressHeight = 4

export const PhaseCard = ({ phase, householdCount, today, change }: PhaseCardProps) => {
  const { colors } = useTheme()
  const pulse = usePulse(change?.at.getTime() ?? null)
  const status = phaseStatus(phase, today)
  const chip = phaseChips[status]
  const meta = `${phaseDuration(phase)} · ${householdCountLabel(householdCount)}`
  const percent = Math.round(phaseProgress(phase, today) * 100)
  const changedOn = change?.changedAt ? formatDate(toIsoDate(change.changedAt)) : null
  const dates = `Beginn ${formatDate(phase.start_date)}, Ende ${formatDate(phase.end_date)}`
  const summary = `${phase.name}, ${phase.building}, ${chip.label}. ${dates}. ${meta}.${changedOn ? ` Geändert am ${changedOn}.` : ''}`
  return (
    <Animated.View style={[{ borderRadius: radius.md }, pulse]}>
      <Card accessible accessibilityLabel={summary} style={{ backgroundColor: 'transparent' }}>
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
        <Text variant="bodySm" color="inkMuted" style={{ marginTop: spacing.sm }}>
          {meta}
        </Text>
        {changedOn && (
          <Text variant="label" weight={400} color="inkMuted" style={{ marginTop: spacing.sm }}>
            {'Geändert am '}
            <Text variant="monoSm" color="inkMuted" style={{ fontSize: 13 }}>
              {changedOn}
            </Text>
          </Text>
        )}
        {status === 'laeuft' && (
          <View
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: percent }}
            style={{ height: progressHeight, borderRadius: progressHeight / 2, marginTop: spacing.md, backgroundColor: colors.line, overflow: 'hidden' }}
          >
            <View style={{ width: `${percent}%`, height: progressHeight, backgroundColor: colors.orange }} />
          </View>
        )}
      </Card>
    </Animated.View>
  )
}
