import { radius, spacing, statusColors, statusLabels, type AssignmentStatus } from '@rochade/shared'
import type { SFSymbol } from 'expo-symbols'
import { View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { Icon } from './Icon'
import { Text } from './Text'

export type BadgeProps = { status: AssignmentStatus }

export const statusSymbols: Record<AssignmentStatus, SFSymbol> = {
  ok: 'checkmark.circle.fill',
  conflict: 'exclamationmark.triangle.fill',
  open: 'clock',
}

export const Badge = ({ status }: BadgeProps) => {
  const { colors } = useTheme()
  const { fg, bg } = statusColors[status]
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Status: ${statusLabels[status]}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: spacing.xs,
        minHeight: 24,
        paddingHorizontal: spacing.sm,
        borderRadius: radius.sm,
        backgroundColor: colors[bg],
      }}
    >
      <Icon name={statusSymbols[status]} size={14} color={fg} />
      <Text variant="label" color={fg}>
        {statusLabels[status]}
      </Text>
    </View>
  )
}
