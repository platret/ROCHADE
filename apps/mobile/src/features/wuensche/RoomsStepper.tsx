import { roomsLabel, spacing } from '@rochade/shared'
import { View, type AccessibilityActionEvent } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from 'react-native-reanimated'
import { haptics } from '@/lib/haptics'
import { Text } from '@/ui/Text'
import { clampRooms, roomsRange } from './needs'
import { StepperButton } from './StepperButton'

export type RoomsStepperProps = {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

const pulseScale = 1.06
const pulseMs = 90

export const RoomsStepper = ({ value, onChange, disabled = false }: RoomsStepperProps) => {
  const reduceMotion = useReducedMotion()
  const scale = useSharedValue(1)
  const valueStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }))

  const step = (direction: 1 | -1) => {
    const next = clampRooms(value + direction * roomsRange.step)
    if (disabled || next === value) return
    haptics.selection()
    if (!reduceMotion) {
      scale.set(
        withSequence(
          withTiming(pulseScale, { duration: pulseMs, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: pulseMs, easing: Easing.inOut(Easing.quad) }),
        ),
      )
    }
    onChange(next)
  }

  const onAccessibilityAction = (event: AccessibilityActionEvent) =>
    step(event.nativeEvent.actionName === 'increment' ? 1 : -1)

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel="Anzahl Zimmer"
      accessibilityValue={{ text: roomsLabel(value) }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={onAccessibilityAction}
      style={{
        minHeight: 72,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
      }}
    >
      <View style={{ flex: 1, minWidth: 140, gap: spacing.xs }}>
        <Text>Anzahl Zimmer</Text>
        <Text variant="bodySm" color="inkMuted">
          Halbe Zimmer möglich
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <StepperButton symbol="minus" label="Zimmer verringern" disabled={disabled || value <= roomsRange.min} onPress={() => step(-1)} />
        <Animated.View style={valueStyle}>
          <Text variant="h2" weight={600} align="center" style={{ minWidth: 48, fontVariant: ['tabular-nums'] }}>
            {String(value)}
          </Text>
        </Animated.View>
        <StepperButton symbol="plus" label="Zimmer erhöhen" disabled={disabled || value >= roomsRange.max} onPress={() => step(1)} />
      </View>
    </View>
  )
}
