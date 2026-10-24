import { spacing, typeScale, wordmark } from '@rochade/shared'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'
import { riseIn } from '@/ui/entering'
import { Logo } from '@/ui/Logo'
import { PopIn } from '@/ui/PopIn'
import { Text } from '@/ui/Text'

const logoSize = 96
const logoDelay = 250
const wordmarkDelay = logoDelay + 180

export const WelcomeStage = () => (
  <View accessible accessibilityRole="image" accessibilityLabel={wordmark.text} style={{ alignItems: 'center', gap: spacing.xl }}>
    <PopIn delay={logoDelay} damping={20}>
      <Logo size={logoSize} />
    </PopIn>
    <Animated.View entering={riseIn(wordmarkDelay)}>
      <Text variant="h1" weight={wordmark.weight} style={{ letterSpacing: typeScale.h1.size * wordmark.letterSpacingEm }}>
        {wordmark.text}
      </Text>
    </Animated.View>
  </View>
)
