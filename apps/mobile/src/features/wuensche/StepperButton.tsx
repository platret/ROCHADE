import type { SFSymbol } from 'expo-symbols'
import { Pressable } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { Icon } from '@/ui/Icon'

export type StepperButtonProps = {
  symbol: SFSymbol
  label: string
  onPress: () => void
  disabled: boolean
}

const size = 44

export const StepperButton = ({ symbol, label, onPress, disabled }: StepperButtonProps) => {
  const { colors } = useTheme()
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => ({
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor: colors.lineStrong,
        backgroundColor: pressed ? colors.surfaceSunken : colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.3 : 1,
      })}
    >
      <Icon name={symbol} size={20} weight="medium" />
    </Pressable>
  )
}
