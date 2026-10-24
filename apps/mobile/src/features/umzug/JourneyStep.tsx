import { spacing } from '@rochade/shared'
import type { ReactNode } from 'react'
import { View } from 'react-native'
import { haptics } from '@/lib/haptics'
import { Flash } from '@/ui/Flash'
import { Icon } from '@/ui/Icon'
import { Tactile } from '@/ui/Tactile'
import { Text } from '@/ui/Text'
import { stepCount, type NodeState } from './steps'
import { RailRow, railStepMs } from './RailRow'
import { StepNode } from './StepNode'

export type JourneyStepProps = {
  index: number
  title: string
  state: NodeState
  current: number
  delay?: number
  flashKey: number | null
  hero: ReactNode
  detail: string
  onPress?: () => void
  accessibilityHint?: string
  children?: ReactNode
}

export const JourneyStep = ({
  index,
  title,
  state,
  current,
  delay = 0,
  flashKey,
  hero,
  detail,
  onPress,
  accessibilityHint,
  children,
}: JourneyStepProps) => {
  const label = `Schritt ${index + 1} von ${stepCount}, ${title}, ${detail}`
  const playKey = `${state}:${flashKey ?? ''}`
  const row = (
    <RailRow
      index={index}
      delay={delay}
      first={index === 0}
      last={index === stepCount - 1}
      topFilled={index > 0 && index <= current}
      bottomFilled={index < current}
      node={<StepNode state={state} number={index + 1} delay={delay + index * railStepMs} playKey={playKey} />}
      accessibilityLabel={onPress ? undefined : label}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text weight={600}>{title}</Text>
          <Flash inline flashKey={flashKey}>
            {hero}
          </Flash>
          {children}
        </View>
        {onPress ? <Icon name="chevron.right" size={17} color="inkMuted" weight="semibold" /> : null}
      </View>
    </RailRow>
  )
  if (!onPress) return row
  return (
    <Tactile
      onPress={onPress}
      onPressIn={haptics.selection}
      scale={0.985}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
    >
      {row}
    </Tactile>
  )
}
