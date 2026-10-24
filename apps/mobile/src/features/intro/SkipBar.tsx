import { gutter, spacing } from '@rochade/shared'
import { Pressable, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { haptics } from '@/lib/haptics'
import { fadeIn, fadeOut } from '@/ui/entering'
import { Text } from '@/ui/Text'

export type SkipBarProps = { visible: boolean; onSkip: () => void }

const barHeight = 44

export const SkipBar = ({ visible, onSkip }: SkipBarProps) => {
  const skip = () => {
    haptics.selection()
    onSkip()
  }
  return (
    <View style={{ height: barHeight, flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: gutter - spacing.sm }}>
      {visible && (
        <Animated.View entering={fadeIn()} exiting={fadeOut()}>
          <Pressable
            onPress={skip}
            accessibilityRole="button"
            accessibilityLabel="Einführung überspringen"
            style={({ pressed }) => ({ height: barHeight, paddingHorizontal: spacing.sm, justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}
          >
            <Text weight={600} color="inkMuted">
              Überspringen
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  )
}
