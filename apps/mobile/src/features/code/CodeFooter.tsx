import { spacing } from '@rochade/shared'
import { router } from 'expo-router'
import { Pressable } from 'react-native'
import Animated from 'react-native-reanimated'
import { haptics } from '@/lib/haptics'
import { fadeIn } from '@/ui/entering'
import { Text } from '@/ui/Text'

export type CodeFooterProps = { delay: number }

const openDemo = () => {
  haptics.selection()
  router.push('/anmelden')
}

export const CodeFooter = ({ delay }: CodeFooterProps) => (
  <Animated.View entering={fadeIn(delay)} style={{ marginTop: spacing.xxl, gap: spacing.sm }}>
    <Pressable
      onPress={openDemo}
      accessibilityRole="button"
      accessibilityLabel="Demo-Haushalt wählen"
      accessibilityHint="Öffnet die Liste der Demo-Haushalte"
      style={({ pressed }) => ({ minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start', opacity: pressed ? 0.6 : 1 })}
    >
      <Text variant="bodySm" weight={600} color="inkMuted" style={{ textDecorationLine: 'underline' }}>
        Demo-Haushalt wählen
      </Text>
    </Pressable>
    <Text variant="caption" color="inkMuted">
      Verwaltung? Der Plan wird im Web geführt.
    </Text>
  </Animated.View>
)
