import { spacing } from '@rochade/shared'
import type { ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { Flash } from '@/ui/Flash'
import { Icon } from '@/ui/Icon'
import { Text } from '@/ui/Text'
import { stepCount, type NodeState } from './steps'
import { RailRow } from './RailRow'
import { StepNode } from './StepNode'

export type JourneyStepProps = {
  index: number
  title: string
  state: NodeState
  flashKey: number | null
  hero: ReactNode
  detail: string
  onPress?: () => void
  accessibilityHint?: string
  children?: ReactNode
}

export const JourneyStep = ({ index, title, state, flashKey, hero, detail, onPress, accessibilityHint, children }: JourneyStepProps) => {
  const { colors } = useTheme()
  const label = `Schritt ${index + 1} von ${stepCount}, ${title}, ${detail}`
  const row = (
    <RailRow
      node={<StepNode state={state} number={index + 1} />}
      first={index === 0}
      last={index === stepCount - 1}
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
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => ({ backgroundColor: pressed ? colors.surfaceSunken : 'transparent' })}
    >
      {row}
    </Pressable>
  )
}
