import { radius, spacing, type ColorName } from '@rochade/shared'
import type { SFSymbol } from 'expo-symbols'
import { View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { Icon } from './Icon'
import { Text } from './Text'

export type ChipTone = 'neutral' | 'accent'

export type ChipProps = { label: string; symbol?: SFSymbol; tone?: ChipTone; dot?: ColorName }

const backgrounds: Record<ChipTone, ColorName> = { neutral: 'surfaceSunken', accent: 'orangeSoft' }

const dotSize = 6

export const Chip = ({ label, symbol, tone = 'neutral', dot }: ChipProps) => {
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
        backgroundColor: colors[backgrounds[tone]],
      }}
    >
      {dot ? <View style={{ width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: colors[dot] }} /> : null}
      {symbol ? <Icon name={symbol} size={14} color="inkMuted" /> : null}
      <Text variant="label">{label}</Text>
    </View>
  )
}
