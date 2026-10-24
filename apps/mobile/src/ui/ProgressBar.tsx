import { radius } from '@rochade/shared'
import { useEffect } from 'react'
import { View, type DimensionValue } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated'
import { useTheme } from '@/theme/useTheme'

export type ProgressBarProps = { value: number; width?: DimensionValue }

const barHeight = 4

export const ProgressBar = ({ value, width = '100%' }: ProgressBarProps) => {
  const { colors } = useTheme()
  const reduceMotion = useReducedMotion()
  const share = Math.min(1, Math.max(0, value))
  const fill = useSharedValue(reduceMotion ? share : 0)

  useEffect(() => {
    fill.set(reduceMotion ? share : withTiming(share, { duration: 450, easing: Easing.out(Easing.cubic) }))
  }, [fill, reduceMotion, share])

  const fillStyle = useAnimatedStyle(() => ({ width: `${fill.get() * 100}%` }))

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width, height: barHeight, borderRadius: radius.sm, overflow: 'hidden', backgroundColor: colors.line }}
    >
      <Animated.View style={[{ height: barHeight, backgroundColor: colors.ink }, fillStyle]} />
    </View>
  )
}
