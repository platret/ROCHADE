import { radius, type ColorName } from '@rochade/shared'
import { useEffect, useState } from 'react'
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native'
import Animated, { cancelAnimation, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'
import { useTheme } from '@/theme/useTheme'
import { Shimmer } from './Shimmer'

export type SkeletonProps = {
  height: number
  width?: DimensionValue
  borderRadius?: number
  color?: ColorName
  style?: StyleProp<ViewStyle>
}

const revealDelayMs = 150

export const Skeleton = ({ height, width = '100%', borderRadius = radius.sm, color = 'surfaceSunken', style }: SkeletonProps) => {
  const { colors } = useTheme()
  const reduceMotion = useReducedMotion()
  const opacity = useSharedValue(0)
  const [measuredWidth, setMeasuredWidth] = useState(0)

  useEffect(() => {
    opacity.set(withDelay(revealDelayMs, withTiming(1, { duration: 150 })))
    return () => cancelAnimation(opacity)
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }))

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onLayout={(event) => setMeasuredWidth(event.nativeEvent.layout.width)}
      style={[{ height, width, borderRadius, overflow: 'hidden', backgroundColor: colors[color] }, animatedStyle, style]}
    >
      {!reduceMotion && measuredWidth > 0 && <Shimmer width={measuredWidth} />}
    </Animated.View>
  )
}
