import { radius, type ColorName } from '@rochade/shared'
import { useEffect } from 'react'
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { useTheme } from '@/theme/useTheme'

export type SkeletonProps = {
  height: number
  width?: DimensionValue
  borderRadius?: number
  color?: ColorName
  style?: StyleProp<ViewStyle>
}

export const Skeleton = ({ height, width = '100%', borderRadius = radius.sm, color = 'surfaceSunken', style }: SkeletonProps) => {
  const { colors } = useTheme()
  const reduceMotion = useReducedMotion()
  const opacity = useSharedValue(0)

  useEffect(() => {
    const reveal = withTiming(1, { duration: 150 })
    const pulse = withRepeat(withSequence(withTiming(0.55, { duration: 600 }), withTiming(1, { duration: 600 })), -1)
    opacity.set(withDelay(150, reduceMotion ? reveal : withSequence(reveal, pulse)))
    return () => cancelAnimation(opacity)
  }, [opacity, reduceMotion])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }))

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ height, width, borderRadius, backgroundColor: colors[color] }, animatedStyle, style]}
    />
  )
}
