import { radius, spacing } from '@rochade/shared'
import { useEffect, type PropsWithChildren } from 'react'
import { StyleSheet, View, type ViewStyle } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'
import { useTheme } from '@/theme/useTheme'

export type FlashProps = PropsWithChildren<{ flashKey: number | null; inline?: boolean }>

const holdMs = 400
const fadeMs = 1600

const inlineBox: ViewStyle = { alignSelf: 'flex-start', paddingHorizontal: spacing.xs, marginHorizontal: -spacing.xs, borderRadius: radius.sm }

export const Flash = ({ flashKey, inline = false, children }: FlashProps) => {
  const { colors } = useTheme()
  const reduceMotion = useReducedMotion()
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (flashKey === null) {
      opacity.set(0)
      return
    }
    const fade = withTiming(0, { duration: fadeMs, easing: Easing.out(Easing.cubic) })
    opacity.set(1)
    opacity.set(reduceMotion ? fade : withDelay(holdMs, fade))
  }, [flashKey, opacity, reduceMotion])

  const overlayStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }))

  return (
    <View style={inline && inlineBox}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.orangeSoft, borderRadius: inline ? radius.sm : 0, pointerEvents: 'none' },
          overlayStyle,
        ]}
      />
      {children}
    </View>
  )
}
