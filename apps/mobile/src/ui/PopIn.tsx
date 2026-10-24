import { useEffect, type PropsWithChildren } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import Animated, { cancelAnimation, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withSpring } from 'react-native-reanimated'

export type PopInProps = PropsWithChildren<{
  delay?: number
  playKey?: string | number | null
  from?: number
  style?: StyleProp<ViewStyle>
}>

const spring = { damping: 18, stiffness: 180 }

export const PopIn = ({ delay = 0, playKey = null, from = 0.6, style, children }: PopInProps) => {
  const reduceMotion = useReducedMotion()
  const progress = useSharedValue(reduceMotion ? 1 : 0)

  useEffect(() => {
    if (reduceMotion) {
      progress.set(1)
      return
    }
    progress.set(0)
    progress.set(withDelay(delay, withSpring(1, spring)))
    return () => cancelAnimation(progress)
  }, [delay, playKey, progress, reduceMotion])

  const animatedStyle = useAnimatedStyle(() => {
    const value = progress.get()
    return { opacity: Math.min(1, value * 2), transform: [{ scale: from + (1 - from) * value }] }
  })

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
}
