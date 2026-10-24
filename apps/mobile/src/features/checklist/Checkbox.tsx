import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { useTheme } from '@/theme/useTheme'
import { Icon } from '@/ui/Icon'

export type CheckboxProps = { checked: boolean }

export const checkboxSize = 24
const ringWidth = 2
const fillFrom = 0.4
const spring = { damping: 18, stiffness: 260 }

export const Checkbox = ({ checked }: CheckboxProps) => {
  const { colors } = useTheme()
  const reduceMotion = useReducedMotion()
  const fill = useSharedValue(checked ? 1 : 0)

  useEffect(() => {
    if (reduceMotion) {
      fill.set(checked ? 1 : 0)
      return
    }
    fill.set(checked ? withSpring(1, spring) : withTiming(0, { duration: 150 }))
  }, [checked, fill, reduceMotion])

  const fillStyle = useAnimatedStyle(() => {
    const value = fill.get()
    return { opacity: Math.min(1, value * 2), transform: [{ scale: fillFrom + (1 - fillFrom) * value }] }
  })
  const markStyle = useAnimatedStyle(() => ({ opacity: Math.max(0, fill.get() * 2 - 1) }))

  return (
    <View
      style={{
        width: checkboxSize,
        height: checkboxSize,
        borderRadius: checkboxSize / 2,
        borderWidth: ringWidth,
        borderColor: colors.lineStrong,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View style={[StyleSheet.absoluteFill, { margin: -ringWidth, borderRadius: checkboxSize / 2, backgroundColor: colors.ink }, fillStyle]} />
      <Animated.View style={markStyle}>
        <Icon name="checkmark" size={12} color="paper" weight="bold" />
      </Animated.View>
    </View>
  )
}
