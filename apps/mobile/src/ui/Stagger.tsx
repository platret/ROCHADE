import type { PropsWithChildren } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import Animated, { Easing, FadeInUp, useReducedMotion } from 'react-native-reanimated'

export type StaggerProps = PropsWithChildren<{
  index: number
  step?: number
  max?: number
  style?: StyleProp<ViewStyle>
}>

const enterMs = 320
const rise = 8

export const staggerDelay = (index: number, step = 50, max = 8) => Math.min(index, max) * step

export const Stagger = ({ index, step = 50, max = 8, style, children }: StaggerProps) => {
  const reduceMotion = useReducedMotion()
  const entering = reduceMotion
    ? undefined
    : FadeInUp.delay(staggerDelay(index, step, max))
        .duration(enterMs)
        .easing(Easing.out(Easing.cubic))
        .withInitialValues({ opacity: 0, transform: [{ translateY: rise }] })
  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  )
}
