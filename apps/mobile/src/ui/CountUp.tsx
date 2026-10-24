import { useEffect, useState } from 'react'
import { Easing, runOnJS, useAnimatedReaction, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'
import { Text, type AppTextProps } from './Text'

export type CountUpProps = Omit<AppTextProps, 'children'> & {
  value: number
  duration?: number
  delay?: number
  pad?: boolean
}

export const CountUp = ({ value, duration = 700, delay = 0, pad = false, style, ...rest }: CountUpProps) => {
  const reduceMotion = useReducedMotion()
  const progress = useSharedValue(reduceMotion ? value : 0)
  const [shown, setShown] = useState(reduceMotion ? value : 0)

  useEffect(() => {
    if (reduceMotion) {
      progress.set(value)
      return
    }
    progress.set(withDelay(delay, withTiming(value, { duration, easing: Easing.out(Easing.cubic) })))
  }, [value, duration, delay, reduceMotion, progress])

  useAnimatedReaction(
    () => Math.round(progress.get()),
    (current, previous) => {
      if (current !== previous) runOnJS(setShown)(current)
    },
  )

  return (
    <Text {...rest} style={[{ fontVariant: ['tabular-nums'] }, style]}>
      {pad ? String(shown).padStart(String(value).length, ' ') : String(shown)}
    </Text>
  )
}
