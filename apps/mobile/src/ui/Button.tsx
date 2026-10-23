import { radius, spacing, type ColorName } from '@rochade/shared'
import type { SFSymbol } from 'expo-symbols'
import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native'
import { haptics } from '@/lib/haptics'
import { useTheme } from '@/theme/useTheme'
import { Icon } from './Icon'
import { Text } from './Text'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

export type ButtonProps = {
  label: string
  onPress: () => void
  variant?: ButtonVariant
  icon?: SFSymbol
  loading?: boolean
  disabled?: boolean
  accessibilityLabel?: string
  style?: StyleProp<ViewStyle>
}

type Look = { background: ColorName | null; border: ColorName | null; text: ColorName }

const looks: Record<ButtonVariant, Look> = {
  primary: { background: 'orangeStrong', border: null, text: 'onOrange' },
  secondary: { background: 'surface', border: 'lineStrong', text: 'ink' },
  ghost: { background: null, border: null, text: 'ink' },
}

export const Button = ({ label, onPress, variant = 'primary', icon, loading = false, disabled = false, accessibilityLabel, style }: ButtonProps) => {
  const { colors } = useTheme()
  const look = looks[variant]
  const inactive = disabled || loading
  const textColor: ColorName = disabled ? 'inkMuted' : look.text
  const press = () => {
    haptics.selection()
    onPress()
  }
  return (
    <Pressable
      onPress={press}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        {
          minHeight: 52,
          borderRadius: radius.md,
          paddingHorizontal: spacing.xl,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
        },
        look.background !== null && { backgroundColor: colors[look.background] },
        look.border !== null && { borderWidth: 1, borderColor: colors[look.border] },
        disabled && variant === 'primary' && { backgroundColor: colors.surfaceSunken },
        pressed && (variant === 'primary' ? { opacity: 0.85 } : { backgroundColor: colors.surfaceSunken }),
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors[textColor]} />
      ) : (
        <>
          {icon ? <Icon name={icon} size={18} color={textColor} weight="semibold" /> : null}
          <Text weight={600} color={textColor}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  )
}
