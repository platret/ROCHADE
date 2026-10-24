import type { PropsWithChildren } from 'react'
import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated'
import { useTheme } from '@/theme/useTheme'

export type TactileProps = PropsWithChildren<
  Omit<PressableProps, 'style' | 'children'> & {
    style?: StyleProp<ViewStyle>
    scale?: number
    tint?: boolean
  }
>

const pressIn = { duration: 90 }
const pressOut = { duration: 180, easing: Easing.out(Easing.cubic) }

export const Tactile = ({ children, style, scale = 0.98, tint = true, onPressIn, onPressOut, ...rest }: TactileProps) => {
  const { colors } = useTheme()
  const reduceMotion = useReducedMotion()
  const pressed = useSharedValue(0)
  const pressedScale = reduceMotion ? 1 : scale
  const radius = StyleSheet.flatten(style)?.borderRadius
  const tintRadius = typeof radius === 'number' ? radius : 0

  const surfaceStyle = useAnimatedStyle(() => ({ transform: [{ scale: 1 + (pressedScale - 1) * pressed.get() }] }))
  const tintStyle = useAnimatedStyle(() => ({ opacity: pressed.get() }))

  return (
    <Pressable
      {...rest}
      onPressIn={(event) => {
        pressed.set(withTiming(1, pressIn))
        onPressIn?.(event)
      }}
      onPressOut={(event) => {
        pressed.set(withTiming(0, pressOut))
        onPressOut?.(event)
      }}
    >
      <Animated.View style={[style, surfaceStyle]}>
        {tint && (
          <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { backgroundColor: colors.surfaceSunken, borderRadius: tintRadius }, tintStyle]}
          />
        )}
        {children}
      </Animated.View>
    </Pressable>
  )
}
