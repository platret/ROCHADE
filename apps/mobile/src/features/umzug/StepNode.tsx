import type { ColorName } from '@rochade/shared'
import { View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { Icon } from '@/ui/Icon'
import { Text } from '@/ui/Text'
import type { NodeState } from './steps'
import { railNodeSize } from './RailRow'

export type StepNodeProps = { state: NodeState; number: number }

type Look = { fill: ColorName | null; border: ColorName | null; content: ColorName }

const looks: Record<NodeState, Look> = {
  done: { fill: 'ink', border: null, content: 'paper' },
  current: { fill: 'orangeStrong', border: null, content: 'onOrange' },
  future: { fill: null, border: 'lineStrong', content: 'inkMuted' },
  conflict: { fill: null, border: 'danger', content: 'danger' },
}

export const StepNode = ({ state, number }: StepNodeProps) => {
  const { colors } = useTheme()
  const look = looks[state]
  return (
    <View
      style={[
        { width: railNodeSize, height: railNodeSize, borderRadius: railNodeSize / 2, alignItems: 'center', justifyContent: 'center' },
        look.fill !== null && { backgroundColor: colors[look.fill] },
        look.border !== null && { borderWidth: 2, borderColor: colors[look.border] },
      ]}
    >
      {state === 'done' ? (
        <Icon name="checkmark" size={14} color={look.content} weight="bold" />
      ) : (
        <Text variant="label" color={look.content} maxFontSizeMultiplier={1.2}>
          {number}
        </Text>
      )}
    </View>
  )
}
