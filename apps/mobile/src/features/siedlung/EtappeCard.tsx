import { formatDate, spacing, type ISODate, type Phase } from '@rochade/shared'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'
import { phaseProgress, phaseStatus } from '@/lib/phases'
import { useTheme } from '@/theme/useTheme'
import { Card } from '@/ui/Card'
import { riseIn } from '@/ui/entering'
import { Text } from '@/ui/Text'
import { useEntered } from '@/ui/useEntered'
import { etappeStatusParts, movesText, type MoveFact } from './etappeFocus'
import { MoveFacts } from './MoveFacts'
import { useReveal } from './useReveal'

export type EtappeCardProps = { label: string; phase: Phase; today: ISODate; moves?: MoveFact[] }

const barHeight = 4

const EtappeProgress = ({ fraction }: { fraction: number }) => {
  const { colors } = useTheme()
  const entered = useEntered()
  const fillStyle = useReveal(entered, 0, fraction)
  return (
    <View style={{ height: barHeight, borderRadius: barHeight / 2, backgroundColor: colors.line, overflow: 'hidden' }}>
      <Animated.View style={[{ height: barHeight, backgroundColor: colors.orangeStrong }, fillStyle]} />
    </View>
  )
}

export const EtappeCard = ({ label, phase, today, moves }: EtappeCardProps) => {
  const running = phaseStatus(phase, today) === 'laeuft'
  const status = etappeStatusParts(phase, today)
  const start = formatDate(phase.start_date)
  const end = formatDate(phase.end_date)
  const spoken = [label, `${phase.name}, ${phase.building}`, `${start} bis ${end}`, status.join(', '), moves && movesText(moves)]
  const summary = spoken.filter(Boolean).join('. ')
  return (
    <Animated.View entering={riseIn()}>
      <Card accessible accessibilityRole="summary" accessibilityLabel={`${summary}.`} style={{ gap: spacing.lg }}>
        <View style={{ gap: spacing.xs }}>
          <Text variant="label" color="inkMuted">
            {label}
          </Text>
          <Text variant="h2">{`${phase.name} · ${phase.building}`}</Text>
          <Text variant="bodySm" color="inkMuted">
            <Text variant="monoSm">{start}</Text>
            {' bis '}
            <Text variant="monoSm">{end}</Text>
          </Text>
        </View>
        <View style={{ gap: spacing.sm }}>
          <Text weight={600}>{status.join(' · ')}</Text>
          <EtappeProgress fraction={running ? phaseProgress(phase, today) : 0} />
        </View>
        {moves && <MoveFacts moves={moves} />}
      </Card>
    </Animated.View>
  )
}
