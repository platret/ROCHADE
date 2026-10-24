import { Easing, FadeIn, FadeInDown, FadeOut, ReduceMotion } from 'react-native-reanimated'

export const staggerMs = 40
const staggerCap = 8
const easeOut = Easing.bezier(0.33, 1, 0.68, 1)

export const staggered = (order: number, base = 0) => base + Math.min(order, staggerCap) * staggerMs

const rise = (duration: number, delay: number) =>
  FadeInDown.duration(duration).delay(delay).easing(easeOut).reduceMotion(ReduceMotion.System)

export const riseIn = (delay = 0) => rise(320, delay)

export const springIn = (delay = 0) => rise(400, delay)

export const fadeIn = (delay = 0) => FadeIn.duration(250).delay(delay).easing(easeOut).reduceMotion(ReduceMotion.System)

export const fadeOut = (duration = 150) => FadeOut.duration(duration).reduceMotion(ReduceMotion.System)
