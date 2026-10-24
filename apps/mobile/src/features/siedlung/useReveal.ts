import { useEffect } from 'react'
import { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'

export const revealStepMs = 60
const revealMs = 450

export const useReveal = (ready: boolean, index: number, fraction = 1) => {
  const reduceMotion = useReducedMotion()
  const progress = useSharedValue(reduceMotion ? 1 : 0)

  useEffect(() => {
    if (!ready) return
    progress.set(
      reduceMotion ? 1 : withDelay(index * revealStepMs, withTiming(1, { duration: revealMs, easing: Easing.out(Easing.cubic) })),
    )
  }, [ready, index, reduceMotion, progress])

  return useAnimatedStyle(() => ({ width: `${progress.get() * fraction * 100}%` }))
}
