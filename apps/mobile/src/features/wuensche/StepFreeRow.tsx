import { spacing } from '@rochade/shared'
import { Switch, View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { Text } from '@/ui/Text'

export type StepFreeRowProps = {
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}

export const StepFreeRow = ({ value, onChange, disabled = false }: StepFreeRowProps) => {
  const { colors } = useTheme()
  return (
    <View
      style={{
        minHeight: 64,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
      }}
    >
      <View style={{ flex: 1, gap: spacing.xs }}>
        <Text>Hindernisfreie Wohnung</Text>
        <Text variant="bodySm" color="inkMuted">
          Keine Treppen, Zugang mit Rollator oder Rollstuhl
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ true: colors.orangeStrong }}
        accessibilityLabel="Hindernisfreie Wohnung"
      />
    </View>
  )
}
