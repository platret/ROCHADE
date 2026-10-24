import type { ReactNode } from 'react'
import { Text } from '@/ui/Text'
import { FlashBox } from './FlashBox'
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
  children?: ReactNode
}

export const JourneyStep = ({ index, title, state, flashKey, hero, detail, children }: JourneyStepProps) => (
  <RailRow
    node={<StepNode state={state} number={index + 1} />}
    first={index === 0}
    last={index === stepCount - 1}
    accessibilityLabel={`Schritt ${index + 1} von ${stepCount}, ${title}, ${detail}`}
  >
    <Text weight={600}>{title}</Text>
    <FlashBox flashKey={flashKey}>{hero}</FlashBox>
    {children}
  </RailRow>
)
