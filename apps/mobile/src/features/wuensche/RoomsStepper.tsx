import { roomsLabel, spacing } from '@rochade/shared'
import { View, type AccessibilityActionEvent } from 'react-native'
import { haptics } from '@/lib/haptics'
import { Text } from '@/ui/Text'
import { clampRooms, roomsRange } from './needs'
import { StepperButton } from './StepperButton'

export type RoomsStepperProps = {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export const RoomsStepper = ({ value, onChange, disabled = false }: RoomsStepperProps) => {
  const step = (direction: 1 | -1) => {
    const next = clampRooms(value + direction * roomsRange.step)
    if (disabled || next === value) return
    haptics.selection()
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
        minHeight: 64,
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
          Halbe Zimmer möglich, z. B. 3.5
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <StepperButton symbol="minus" label="Zimmer verringern" disabled={disabled || value <= roomsRange.min} onPress={() => step(-1)} />
        <Text variant="h2" weight={600} align="center" style={{ minWidth: 56, fontVariant: ['tabular-nums'] }}>
          {String(value)}
        </Text>
        <StepperButton symbol="plus" label="Zimmer erhöhen" disabled={disabled || value >= roomsRange.max} onPress={() => step(1)} />
      </View>
    </View>
  )
}
