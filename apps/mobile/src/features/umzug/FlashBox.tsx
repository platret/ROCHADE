import { radius, spacing } from '@rochade/shared'
import { useEffect, type PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'
import { useTheme } from '@/theme/useTheme'

export type FlashBoxProps = PropsWithChildren<{ flashKey: number | null }>

const holdMs = 400
const fadeMs = 1600

export const FlashBox = ({ flashKey, children }: FlashBoxProps) => {
  const { colors } = useTheme()
  const reduceMotion = useReducedMotion()
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (flashKey === null || reduceMotion) {
      opacity.set(0)
      return
    }
    opacity.set(1)
    opacity.set(withDelay(holdMs, withTiming(0, { duration: fadeMs, easing: Easing.out(Easing.cubic) })))
  }, [flashKey, opacity, reduceMotion])

  const overlayStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }))

  return (
    <View style={{ alignSelf: 'flex-start', paddingHorizontal: spacing.xs, marginHorizontal: -spacing.xs, borderRadius: radius.sm }}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.orangeSoft, borderRadius: radius.sm, pointerEvents: 'none' }, overlayStyle]}
      />
      {children}
    </View>
  )
}
