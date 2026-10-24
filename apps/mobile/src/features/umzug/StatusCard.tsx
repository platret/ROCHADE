import { reassurance, spacing, statusColors, statusLabels, type Assignment, type AssignmentStatus } from '@rochade/shared'
import { View } from 'react-native'
import { statusSymbols } from '@/ui/Badge'
import { Card } from '@/ui/Card'
import { Icon } from '@/ui/Icon'
import { LeadingCircle } from '@/ui/LeadingCircle'
import { Text } from '@/ui/Text'

export type StatusCardProps = { assignment: Assignment }

const sentences: Record<AssignmentStatus, string> = {
  ok: 'Deine Rochade-Wohnung ist reserviert, alle Termine sind bestätigt.',
  conflict: reassurance,
  open: 'Deine Zuteilung ist noch in Arbeit.',
}

export const StatusCard = ({ assignment }: StatusCardProps) => {
  const { status, conflict_reason } = assignment
  const { fg, bg } = statusColors[status]
  return (
    <Card style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
      <LeadingCircle color={bg}>
        <Icon name={statusSymbols[status]} size={22} color={fg} />
      </LeadingCircle>
      <View style={{ flex: 1, gap: spacing.xs }}>
        <Text variant="h2" accessibilityRole="header">
          {statusLabels[status]}
        </Text>
        {status === 'conflict' && conflict_reason !== null && <Text weight={600}>{conflict_reason}</Text>}
        <Text color="inkMuted">{sentences[status]}</Text>
      </View>
    </Card>
  )
}
