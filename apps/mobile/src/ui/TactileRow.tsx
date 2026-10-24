import { spacing } from '@rochade/shared'
import type { ReactNode } from 'react'
import { View } from 'react-native'
import { Icon } from './Icon'
import { Tactile } from './Tactile'
import { Text } from './Text'

export type TactileRowProps = {
  title: string
  subtitle?: ReactNode
  leading?: ReactNode
  onPress: () => void
  onPressIn?: () => void
  accessibilityLabel?: string
  accessibilityHint?: string
}

export const TactileRow = ({ title, subtitle, leading, onPress, onPressIn, accessibilityLabel, accessibilityHint }: TactileRowProps) => (
  <Tactile
    onPress={onPress}
    onPressIn={onPressIn}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel ?? title}
    accessibilityHint={accessibilityHint}
    style={{
      minHeight: 64,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    }}
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
    <Icon name="chevron.right" size={17} color="inkMuted" weight="semibold" />
  </Tactile>
)
