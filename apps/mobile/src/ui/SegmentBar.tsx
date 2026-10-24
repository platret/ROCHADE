import { radius, spacing, type ColorName } from '@rochade/shared'
import { useEffect } from 'react'
import { View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated'
import { useTheme } from '@/theme/useTheme'

export type SegmentBarProps = { count: number; current: number; accessibilityLabel?: string }

const barHeight = 4

const segmentColor = (index: number, current: number): ColorName => (index < current ? 'ink' : 'line')

export const SegmentBar = ({ count, current, accessibilityLabel }: SegmentBarProps) => {
  const { colors } = useTheme()
  const reduceMotion = useReducedMotion()
  const fill = useSharedValue(reduceMotion ? 1 : 0)

  useEffect(() => {
    if (reduceMotion) {
      fill.set(1)
      return
    }
    fill.set(0)
    fill.set(withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }))
  }, [current, fill, reduceMotion])

  const fillStyle = useAnimatedStyle(() => ({ width: `${fill.get() * 100}%` }))

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? `Schritt ${current + 1} von ${count}`}
      style={{ flexDirection: 'row', gap: spacing.xs }}
    >
      {Array.from({ length: count }, (_, index) => (
        <View
          key={index}
          style={{
            flex: 1,
            height: barHeight,
            borderRadius: radius.sm,
            overflow: 'hidden',
            backgroundColor: colors[segmentColor(index, current)],
          }}
        >
          {index === current && <Animated.View style={[{ height: barHeight, backgroundColor: colors.orangeStrong }, fillStyle]} />}
        </View>
      ))}
    </View>
  )
}
