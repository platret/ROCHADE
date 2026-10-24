import { useEffect } from 'react'
import { interpolateColor, useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from 'react-native-reanimated'
import { useTheme } from '@/theme/useTheme'

export const usePulse = (trigger: number | null) => {
  const { colors } = useTheme()
  const reduceMotion = useReducedMotion()
  const progress = useSharedValue(0)

  useEffect(() => {
    if (trigger === null || reduceMotion) return
    progress.set(withSequence(withTiming(1, { duration: 150 }), withTiming(0, { duration: 450 })))
  }, [trigger, reduceMotion, progress])

  return useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.get(), [0, 1], [colors.surface, colors.surfaceSunken]),
  }))
}
