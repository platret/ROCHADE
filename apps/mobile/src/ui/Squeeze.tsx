import type { PropsWithChildren } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated'

export type SqueezeProps = PropsWithChildren<{ disabled?: boolean; scale?: number; style?: StyleProp<ViewStyle> }>

const pressIn = { duration: 90 }
const pressOut = { duration: 180, easing: Easing.out(Easing.cubic) }

export const Squeeze = ({ disabled = false, scale = 0.98, style, children }: SqueezeProps) => {
  const reduceMotion = useReducedMotion()
  const pressed = useSharedValue(0)
  const active = !disabled && !reduceMotion

  const press = (down: boolean) => {
    if (active) pressed.set(withTiming(down ? 1 : 0, down ? pressIn : pressOut))
  }

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: 1 + (scale - 1) * pressed.get() }] }))

  return (
    <Animated.View
      onTouchStart={() => press(true)}
      onTouchEnd={() => press(false)}
      onTouchCancel={() => press(false)}
      style={[style, animatedStyle]}
    >
      {children}
    </Animated.View>
  )
}
