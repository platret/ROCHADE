import { useEffect, type PropsWithChildren } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import Animated, { cancelAnimation, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withSpring } from 'react-native-reanimated'

export type PopInProps = PropsWithChildren<{
  delay?: number
  playKey?: string | number | null
  play?: boolean
  from?: number
  damping?: number
  style?: StyleProp<ViewStyle>
}>

const spring = { damping: 18, stiffness: 180 }

export const PopIn = ({ delay = 0, playKey = null, play = true, from = 0.6, damping = spring.damping, style, children }: PopInProps) => {
  const reduceMotion = useReducedMotion()
  const progress = useSharedValue(reduceMotion ? 1 : 0)

  useEffect(() => {
    if (reduceMotion) {
      progress.set(1)
      return
    }
    if (!play) return
    progress.set(0)
    progress.set(withDelay(delay, withSpring(1, { ...spring, damping })))
    return () => cancelAnimation(progress)
  }, [damping, delay, play, playKey, progress, reduceMotion])

  const animatedStyle = useAnimatedStyle(() => {
    const value = progress.get()
    return { opacity: Math.min(1, value * 2), transform: [{ scale: from + (1 - from) * value }] }
  })

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
}
