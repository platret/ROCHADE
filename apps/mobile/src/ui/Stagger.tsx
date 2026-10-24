import { useEffect, type PropsWithChildren } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'

export type StaggerProps = PropsWithChildren<{
  index: number
  step?: number
  max?: number
  play?: boolean
  style?: StyleProp<ViewStyle>
}>

const enterMs = 320
const rise = 8
const easeOut = Easing.out(Easing.cubic)

export const staggerDelay = (index: number, step = 50, max = 8) => Math.min(index, max) * step

export const Stagger = ({ index, step = 50, max = 8, play = true, style, children }: StaggerProps) => {
  const reduceMotion = useReducedMotion()
  const progress = useSharedValue(reduceMotion ? 1 : 0)

  useEffect(() => {
    if (reduceMotion) {
      progress.set(1)
      return
    }
    if (!play) return
    progress.set(withDelay(staggerDelay(index, step, max), withTiming(1, { duration: enterMs, easing: easeOut })))
    return () => cancelAnimation(progress)
  }, [index, max, play, progress, reduceMotion, step])

  const animatedStyle = useAnimatedStyle(() => {
    const value = progress.get()
    return { opacity: value, transform: [{ translateY: rise * (1 - value) }] }
  })

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
}
