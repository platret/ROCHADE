import { spacing } from '@rochade/shared'
import type { ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { Icon } from './Icon'
import { Text } from './Text'

export type ListRowProps = {
  title: string
  subtitle?: ReactNode
  leading?: ReactNode
  trailing?: ReactNode
  onPress?: () => void
  accessibilityLabel?: string
  disabled?: boolean
}

export const ListRow = ({ title, subtitle, leading, trailing, onPress, accessibilityLabel, disabled = false }: ListRowProps) => {
  const { colors } = useTheme()
  const chevron = onPress ? <Icon name="chevron.right" size={17} color="inkMuted" weight="semibold" /> : null
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled }}
      style={({ pressed }) => ({
        minHeight: 64,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        backgroundColor: pressed ? colors.surfaceSunken : 'transparent',
      })}
    >
      {leading}
      <View style={{ flex: 1, gap: spacing.xs }}>
        <Text weight={600} numberOfLines={1}>
          {title}
        </Text>
        {subtitle != null && (
          <Text variant="bodySm" color="inkMuted">
            {subtitle}
          </Text>
        )}
      </View>
      {trailing === undefined ? chevron : trailing}
    </Pressable>
  )
}
