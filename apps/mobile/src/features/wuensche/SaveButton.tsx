import { radius, spacing } from '@rochade/shared'
import { useEffect } from 'react'
import { View } from 'react-native'
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { useTheme } from '@/theme/useTheme'
import { Button } from '@/ui/Button'
import { Icon } from '@/ui/Icon'
import { Text } from '@/ui/Text'
import type { SavePhase } from './useWishesForm'

export type SaveButtonProps = {
  dirty: boolean
  phase: SavePhase
  onSave: () => void
}

const checkSpring = { damping: 22, stiffness: 240 }
const checkStart = 0.5

const SavedCheck = () => {
  const reduceMotion = useReducedMotion()
  const scale = useSharedValue(reduceMotion ? 1 : checkStart)
  const opacity = useSharedValue(reduceMotion ? 1 : 0)

  useEffect(() => {
    if (reduceMotion) return
    scale.set(withSpring(1, checkSpring))
    opacity.set(withTiming(1, { duration: 160 }))
  }, [reduceMotion, scale, opacity])

  const style = useAnimatedStyle(() => ({ opacity: opacity.get(), transform: [{ scale: scale.get() }] }))

  return (
    <Animated.View style={style}>
      <Icon name="checkmark" size={18} color="onOrange" weight="semibold" />
    </Animated.View>
  )
}

export const SaveButton = ({ dirty, phase, onSave }: SaveButtonProps) => {
  const { colors } = useTheme()
  if (phase !== 'saved') {
    return <Button label="Speichern" loading={phase === 'saving'} disabled={!dirty} onPress={onSave} />
  }
  return (
    <View
      accessibilityRole="button"
      accessibilityLabel="Gespeichert"
      accessibilityState={{ disabled: true }}
      accessibilityLiveRegion="polite"
      style={{
        minHeight: 52,
        borderRadius: radius.md,
        paddingHorizontal: spacing.xl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: colors.orangeStrong,
      }}
    >
      <SavedCheck />
      <Text weight={600} color="onOrange">
        Gespeichert
      </Text>
    </View>
  )
}
