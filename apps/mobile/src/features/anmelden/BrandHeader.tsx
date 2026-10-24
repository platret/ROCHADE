import { spacing, tagline, typeScale, wordmark } from '@rochade/shared'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'
import { riseIn } from '@/ui/entering'
import { Logo } from '@/ui/Logo'
import { PopIn } from '@/ui/PopIn'
import { Text } from '@/ui/Text'

export const brandDelays = { wordmark: 60, tagline: 140 } as const

export const BrandHeader = () => (
  <View>
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={wordmark.text}
      style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}
    >
      <PopIn from={0.7}>
        <Logo size={40} tile />
      </PopIn>
      <Animated.View entering={riseIn(brandDelays.wordmark)}>
        <Text variant="h1" weight={wordmark.weight} style={{ letterSpacing: typeScale.h1.size * wordmark.letterSpacingEm }}>
          {wordmark.text}
        </Text>
      </Animated.View>
    </View>
    <Animated.View entering={riseIn(brandDelays.tagline)}>
      <Text color="inkMuted" numberOfLines={2} style={{ marginTop: spacing.sm }}>
        {tagline}
      </Text>
    </Animated.View>
  </View>
)
