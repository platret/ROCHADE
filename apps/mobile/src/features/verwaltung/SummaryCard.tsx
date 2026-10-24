import { assignmentStatuses, spacing, statusColors, statusLabels, type AssignmentStatus } from '@rochade/shared'
import { StyleSheet, View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { statusSymbols } from '@/ui/Badge'
import { Card } from '@/ui/Card'
import { CountUp } from '@/ui/CountUp'
import { Icon } from '@/ui/Icon'
import { Text } from '@/ui/Text'
import { useEntered } from '@/ui/useEntered'
import type { StatusCounts } from './overview'

export type SummaryCardProps = { counts: StatusCounts }

const summaryLabels: Record<AssignmentStatus, string> = { ...statusLabels, conflict: 'Konflikte' }
const countDelayMs = 80

const labelFor = (status: AssignmentStatus, count: number) =>
  status === 'conflict' && count === 1 ? statusLabels.conflict : summaryLabels[status]

export const SummaryCard = ({ counts }: SummaryCardProps) => {
  const { colors } = useTheme()
  const entered = useEntered()
  const summary = assignmentStatuses.map((status) => `${counts[status]} ${labelFor(status, counts[status])}`).join(', ')
  return (
    <Card accessible accessibilityRole="summary" accessibilityLabel={summary} style={{ flexDirection: 'row', padding: 0 }}>
      {assignmentStatuses.map((status, index) => (
        <View
          key={status}
          style={[
            { flex: 1, padding: spacing.lg, gap: spacing.sm },
            index > 0 && { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: colors.line },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <Icon name={statusSymbols[status]} size={14} color={statusColors[status].fg} />
            <Text variant="label" color="inkMuted" style={{ flexShrink: 1 }}>
              {labelFor(status, counts[status])}
            </Text>
          </View>
          <CountUp
            value={counts[status]}
            delay={index * countDelayMs}
            play={entered}
            variant="monoLarge"
            color={status === 'conflict' && counts[status] > 0 ? 'danger' : 'ink'}
          />
        </View>
      ))}
    </Card>
  )
}
