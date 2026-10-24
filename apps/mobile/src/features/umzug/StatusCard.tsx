import { reassurance, spacing, statusColors, statusLabels, type Assignment, type AssignmentStatus } from '@rochade/shared'
import { View } from 'react-native'
import { statusSymbols } from '@/ui/Badge'
import { Card } from '@/ui/Card'
import { Gradient } from '@/ui/Gradient'
import { Icon } from '@/ui/Icon'
import { LeadingCircle } from '@/ui/LeadingCircle'
import { Text } from '@/ui/Text'
import { residentReason } from './reason'

export type StatusCardProps = { assignment: Assignment; householdName: string }

const sentences: Record<AssignmentStatus, string> = {
  ok: 'Deine Rochade-Wohnung ist reserviert, alle Termine sind bestätigt.',
  conflict: reassurance,
  open: 'Deine Zuteilung ist noch in Arbeit.',
}

const iconCircle = 48
const washOpacity = 0.45

export const StatusCard = ({ assignment, householdName }: StatusCardProps) => {
  const { status, conflict_reason } = assignment
  const { fg, bg } = statusColors[status]
  const reason = status === 'conflict' && conflict_reason !== null ? residentReason(conflict_reason, householdName) : null
  return (
    <Card style={{ overflow: 'hidden', gap: spacing.md }}>
      <Gradient color={bg} opacities={[washOpacity, 0]} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <LeadingCircle size={iconCircle} color={bg}>
          <Icon name={statusSymbols[status]} size={24} color={fg} />
        </LeadingCircle>
        <Text variant="h1" accessibilityRole="header" style={{ flex: 1 }}>
          {statusLabels[status]}
        </Text>
      </View>
      {reason !== null && <Text weight={600}>{reason}</Text>}
      <Text color="inkMuted">{sentences[status]}</Text>
    </Card>
  )
}
