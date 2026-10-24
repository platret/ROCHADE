import { RailRow, railStepMs } from '@/features/umzug/RailRow'
import { StepNode } from '@/features/umzug/StepNode'
import type { NodeState } from '@/features/umzug/steps'
import { Card } from '@/ui/Card'
import { Text } from '@/ui/Text'
import { useLatched } from '@/ui/useEntered'
import type { StageProps } from './stage'

type Row = { title: string; value: string; prefix?: string; state: NodeState }

const rows: Row[] = [
  { title: 'Auszug', value: '01.03.2027', state: 'current' },
  { title: 'Rochade-Wohnung', prefix: 'Whg. ', value: 'D.01', state: 'future' },
  { title: 'Rückkehr', value: '31.05.2027', state: 'future' },
]

const label = 'Beispiel: Auszug am 01.03.2027, Rochade-Wohnung D.01, Rückkehr am 31.05.2027'

export const RailStage = ({ active }: StageProps) => {
  const play = useLatched(active)
  return (
    <Card accessible accessibilityLabel={label} style={{ padding: 0, overflow: 'hidden' }}>
      {rows.map((row, index) => (
        <RailRow
          key={row.title}
          index={index}
          first={index === 0}
          last={index === rows.length - 1}
          play={play}
          node={<StepNode state={row.state} number={index + 1} delay={index * railStepMs} play={play} />}
        >
          <Text weight={600}>{row.title}</Text>
          {row.prefix ? (
            <Text variant="h2" weight={600}>
              {row.prefix}
              <Text variant="monoLarge">{row.value}</Text>
            </Text>
          ) : (
            <Text variant="monoLarge">{row.value}</Text>
          )}
        </RailRow>
      ))}
    </Card>
  )
}
