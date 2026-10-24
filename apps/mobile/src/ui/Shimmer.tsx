import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import { Gradient } from './Gradient'

export type ShimmerProps = { width: number }

const periodMs = 1200
const minBand = 64

export const Shimmer = ({ width }: ShimmerProps) => {
  const band = Math.max(minBand, Math.round(width * 0.6))
  const offset = useSharedValue(-band)

  useEffect(() => {
    offset.set(-band)
    offset.set(withRepeat(withTiming(width, { duration: periodMs, easing: Easing.linear }), -1, false))
    return () => cancelAnimation(offset)
  }, [band, offset, width])

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: offset.get() }] }))

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { width: band }, animatedStyle]}>
      <Gradient color="surface" opacities={[0, 0.8, 0]} horizontal />
    </Animated.View>
  )
}
