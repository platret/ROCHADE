import { spacing } from '@rochade/shared'
import { router } from 'expo-router'
import { Pressable, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { haptics } from '@/lib/haptics'
import { Chip } from '@/ui/Chip'
import { fadeIn } from '@/ui/entering'
import { Icon } from '@/ui/Icon'
import { Text } from '@/ui/Text'

const back = () => {
  haptics.selection()
  if (router.canGoBack()) router.back()
  else router.replace('/code')
}

export const DemoHeader = () => (
  <Animated.View
    entering={fadeIn()}
    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xl }}
  >
    <Pressable
      onPress={back}
      accessibilityRole="button"
      accessibilityLabel="Zurück zum Zugangscode"
      style={({ pressed }) => ({
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginLeft: -spacing.xs,
        paddingRight: spacing.md,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Icon name="chevron.left" size={16} color="inkMuted" weight="semibold" />
      <Text weight={600} color="inkMuted">
        Zurück
      </Text>
    </Pressable>
    <View accessible accessibilityLabel="Demo-Modus">
      <Chip label="Demo" />
    </View>
  </Animated.View>
)
