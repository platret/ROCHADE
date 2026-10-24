import type { SFSymbol } from 'expo-symbols'
import { useTheme } from '@/theme/useTheme'
import { Icon } from '@/ui/Icon'
import { Tactile } from '@/ui/Tactile'

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
    <Tactile
      onPress={onPress}
      disabled={disabled}
      scale={0.94}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor: colors.lineStrong,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.3 : 1,
      }}
    >
      <Icon name={symbol} size={20} weight="medium" />
    </Tactile>
  )
}
