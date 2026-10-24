import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import Animated, { useAnimatedStyle, useReducedMotion, withTiming } from 'react-native-reanimated'
import { useTheme } from '@/theme/useTheme'

export type DotsProps = { count: number; active: number }

const dotSize = 8
const activeWidth = 24
const timing = { duration: 220 }

const Dot = ({ on }: { on: boolean }) => {
  const { colors } = useTheme()
  const reduceMotion = useReducedMotion()
  const width = on ? activeWidth : dotSize
  const color = on ? colors.ink : colors.lineStrong
  const animatedStyle = useAnimatedStyle(() => ({
    width: reduceMotion ? width : withTiming(width, timing),
    backgroundColor: reduceMotion ? color : withTiming(color, timing),
  }))
  return <Animated.View style={[{ height: dotSize, borderRadius: dotSize / 2 }, animatedStyle]} />
}

export const Dots = ({ count, active }: DotsProps) => (
  <View
    accessible
    accessibilityLabel={`Seite ${active + 1} von ${count}`}
    style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.sm }}
  >
    {Array.from({ length: count }, (_, index) => (
      <Dot key={index} on={index === active} />
    ))}
  </View>
)
