import { Easing, FadeIn, FadeInDown, FadeOut, ReduceMotion } from 'react-native-reanimated'

export const staggerMs = 40
const staggerCap = 8
const easeOut = Easing.out(Easing.cubic)

export const staggered = (order: number, base = 0) => base + Math.min(order, staggerCap) * staggerMs

export const riseIn = (delay = 0) =>
  FadeInDown.duration(320)
    .delay(delay)
    .easing(easeOut)
    .reduceMotion(ReduceMotion.System)
    .withInitialValues({ opacity: 0, transform: [{ translateY: 10 }] })

export const springIn = (delay = 0) =>
  FadeInDown.springify()
    .damping(18)
    .stiffness(160)
    .delay(delay)
    .reduceMotion(ReduceMotion.System)
    .withInitialValues({ opacity: 0, transform: [{ translateY: 12 }] })

export const fadeIn = (delay = 0) => FadeIn.duration(250).delay(delay).easing(easeOut).reduceMotion(ReduceMotion.System)

export const fadeOut = (duration = 150) => FadeOut.duration(duration).reduceMotion(ReduceMotion.System)
