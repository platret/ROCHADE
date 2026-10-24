import { useEffect, useState } from 'react'
import { View, type TextProps } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated'
import { useTheme } from '@/theme/useTheme'
import { Text } from '@/ui/Text'

export type StrikeTextProps = { struck: boolean; children: string }

type TextLayoutLine = Parameters<NonNullable<TextProps['onTextLayout']>>[0]['nativeEvent']['lines'][number]

const lineThickness = 1.5
const strikeMsPerLine = 200
const unstrikeMs = 150

type StrikeLineProps = { line: TextLayoutLine; index: number; count: number; progress: SharedValue<number> }

const StrikeLine = ({ line, index, count, progress }: StrikeLineProps) => {
  const { colors } = useTheme()
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: Math.min(1, Math.max(0, progress.get() * count - index)) }],
  }))
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: 'absolute', left: line.x, top: line.y + (line.height - lineThickness) / 2, width: line.width, height: lineThickness },
        { backgroundColor: colors.inkMuted, transformOrigin: 'left' },
        animatedStyle,
      ]}
    />
  )
}

export const StrikeText = ({ struck, children }: StrikeTextProps) => {
  const reduceMotion = useReducedMotion()
  const [lines, setLines] = useState<TextLayoutLine[]>([])
  const progress = useSharedValue(struck ? 1 : 0)
  const count = Math.max(1, lines.length)

  useEffect(() => {
    const target = struck ? 1 : 0
    if (reduceMotion) {
      progress.set(target)
      return
    }
    const duration = struck ? strikeMsPerLine * count : unstrikeMs
    progress.set(withTiming(target, { duration, easing: Easing.out(Easing.quad) }))
  }, [count, progress, reduceMotion, struck])

  return (
    <View>
      <Text color={struck ? 'inkMuted' : 'ink'} onTextLayout={(event) => setLines(event.nativeEvent.lines)}>
        {children}
      </Text>
      {lines.map((line, index) => (
        <StrikeLine key={index} line={line} index={index} count={count} progress={progress} />
      ))}
    </View>
  )
}
