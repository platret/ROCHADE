import { useEffect } from 'react'
import { View } from 'react-native'
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated'
import { Badge } from '@/ui/Badge'

export type StatusSwapProps = { resolved: boolean }

const crossfade = { duration: 450 }

export const StatusSwap = ({ resolved }: StatusSwapProps) => {
  const reduceMotion = useReducedMotion()
  const progress = useSharedValue(0)

  useEffect(() => {
    if (!resolved) return
    progress.set(reduceMotion ? 1 : withTiming(1, crossfade))
  }, [progress, reduceMotion, resolved])

  const outStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.get() }))
  const inStyle = useAnimatedStyle(() => ({ opacity: progress.get() }))

  return (
    <View>
      <Animated.View style={outStyle}>
        <Badge status="conflict" />
      </Animated.View>
      <Animated.View style={[{ position: 'absolute', top: 0, right: 0 }, inStyle]}>
        <Badge status="ok" />
      </Animated.View>
    </View>
  )
}
