import { radius, spacing } from '@rochade/shared'
import type { SFSymbol } from 'expo-symbols'
import { View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { Icon } from './Icon'
import { Text } from './Text'

export type ChipProps = { label: string; symbol?: SFSymbol }

export const Chip = ({ label, symbol }: ChipProps) => {
  const { colors } = useTheme()
  return (
    <View
      accessibilityRole="text"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: spacing.xs,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: radius.sm,
        backgroundColor: colors.surfaceSunken,
      }}
    >
      {symbol ? <Icon name={symbol} size={14} color="inkMuted" /> : null}
      <Text variant="label">{label}</Text>
    </View>
  )
}
