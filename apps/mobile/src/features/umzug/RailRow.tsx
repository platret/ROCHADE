import { spacing, typeScale } from '@rochade/shared'
import { useEffect, type PropsWithChildren, type ReactNode } from 'react'
import { View } from 'react-native'
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'
import { useTheme } from '@/theme/useTheme'

export const railNodeSize = 28
export const railStepMs = 240
const connectorWidth = 2
const nodeOffset = spacing.lg + (typeScale.body.lineHeight - railNodeSize) / 2
const topDrawMs = 40
const bottomDrawMs = 160

type SegmentProps = { top: boolean; filled: boolean; delay: number; draw: boolean }

const Segment = ({ top, filled, delay, draw }: SegmentProps) => {
  const { colors } = useTheme()
  const reduceMotion = useReducedMotion()
  const animated = draw && !reduceMotion
  const drawn = useSharedValue(animated ? 0 : 1)

  useEffect(() => {
    if (!animated) {
      drawn.set(1)
      return
    }
    drawn.set(0)
    drawn.set(withDelay(delay, withTiming(1, { duration: top ? topDrawMs : bottomDrawMs, easing: Easing.linear })))
    return () => cancelAnimation(drawn)
  }, [animated, delay, drawn, top])

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scaleY: drawn.get() }] }))

  return (
    <Animated.View
      style={[
        top ? { height: nodeOffset } : { flex: 1 },
        { width: connectorWidth, backgroundColor: colors[filled ? 'ink' : 'line'], transformOrigin: 'top' },
        animatedStyle,
      ]}
    />
  )
}

export type RailRowProps = PropsWithChildren<{
  node: ReactNode
  first: boolean
  last: boolean
  index?: number
  delay?: number
  topFilled?: boolean
  bottomFilled?: boolean
  draw?: boolean
  accessibilityLabel?: string
}>

export const RailRow = ({
  node,
  first,
  last,
  index = 0,
  delay = 0,
  topFilled = false,
  bottomFilled = false,
  draw = true,
  accessibilityLabel,
  children,
}: RailRowProps) => {
  const nodeAt = delay + index * railStepMs
  return (
    <View
      accessible={accessibilityLabel !== undefined}
      accessibilityLabel={accessibilityLabel}
      style={{ flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.lg }}
    >
      <View style={{ width: railNodeSize, alignItems: 'center' }}>
        {first ? <View style={{ height: nodeOffset }} /> : <Segment top filled={topFilled} delay={nodeAt - topDrawMs} draw={draw} />}
        <View style={{ zIndex: 1 }}>{node}</View>
        {!last && <Segment top={false} filled={bottomFilled} delay={nodeAt + topDrawMs} draw={draw} />}
      </View>
      <View style={{ flex: 1, paddingVertical: spacing.lg, gap: spacing.xs }}>{children}</View>
    </View>
  )
}
