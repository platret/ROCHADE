import type { ColorName } from '@rochade/shared'
import { useEffect } from 'react'
import { View } from 'react-native'
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withSequence, withTiming } from 'react-native-reanimated'
import { useTheme } from '@/theme/useTheme'
import { Icon } from '@/ui/Icon'
import { PopIn } from '@/ui/PopIn'
import { Text } from '@/ui/Text'
import type { NodeState } from './steps'
import { railNodeSize } from './RailRow'

export type StepNodeProps = { state: NodeState; number: number; delay?: number; playKey?: string }

type Look = { fill: ColorName | null; border: ColorName | null; content: ColorName }

const looks: Record<NodeState, Look> = {
  done: { fill: 'ink', border: null, content: 'paper' },
  current: { fill: 'orangeStrong', border: null, content: 'onOrange' },
  future: { fill: null, border: 'lineStrong', content: 'inkMuted' },
  conflict: { fill: null, border: 'danger', content: 'danger' },
}

const haloSize = 40
const haloInset = (railNodeSize - haloSize) / 2
const haloLagMs = 100

const Halo = ({ delay, playKey }: { delay: number; playKey: string }) => {
  const { colors } = useTheme()
  const reduceMotion = useReducedMotion()
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (reduceMotion) {
      opacity.set(0)
      return
    }
    opacity.set(0)
    opacity.set(
      withDelay(
        delay + haloLagMs,
        withSequence(withTiming(1, { duration: 150 }), withTiming(0, { duration: 1200, easing: Easing.out(Easing.quad) })),
      ),
    )
    return () => cancelAnimation(opacity)
  }, [delay, opacity, playKey, reduceMotion])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }))

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: 'absolute', top: haloInset, left: haloInset, width: haloSize, height: haloSize, borderRadius: haloSize / 2 },
        { backgroundColor: colors.orangeSoft },
        animatedStyle,
      ]}
    />
  )
}

export const StepNode = ({ state, number, delay = 0, playKey = state }: StepNodeProps) => {
  const { colors } = useTheme()
  const look = looks[state]
  return (
    <View style={{ width: railNodeSize, height: railNodeSize }}>
      {state === 'current' && <Halo delay={delay} playKey={playKey} />}
      <PopIn delay={delay} playKey={playKey}>
        <View
          style={[
            { width: railNodeSize, height: railNodeSize, borderRadius: railNodeSize / 2, alignItems: 'center', justifyContent: 'center' },
            look.fill !== null && { backgroundColor: colors[look.fill] },
            look.border !== null && { borderWidth: 2, borderColor: colors[look.border] },
          ]}
        >
          {state === 'done' ? (
            <Icon name="checkmark" size={14} color={look.content} weight="bold" />
          ) : (
            <Text variant="label" color={look.content} maxFontSizeMultiplier={1.2}>
              {number}
            </Text>
          )}
        </View>
      </PopIn>
    </View>
  )
}
