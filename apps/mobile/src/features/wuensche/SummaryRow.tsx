import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import { Text } from '@/ui/Text'

export type SummaryRowProps = {
  label: string
  value: string | null
  empty?: string
  prose?: boolean
}

export const SummaryRow = ({ label, value, empty = 'Keine Angabe', prose = false }: SummaryRowProps) => {
  const shown = value && value.trim().length > 0 ? value : null
  return (
    <View
      accessible
      accessibilityRole="text"
      style={{
        minHeight: 64,
        justifyContent: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
      }}
    >
      <Text variant="label" color="inkMuted">
        {label}
      </Text>
      <Text variant={prose ? 'body' : 'h3'} color={shown ? 'ink' : 'inkMuted'}>
        {shown ?? empty}
      </Text>
    </View>
  )
}
