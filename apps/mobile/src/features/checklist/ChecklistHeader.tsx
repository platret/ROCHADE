import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { useTheme } from '@/theme/useTheme'
import { Text } from '@/ui/Text'
import { ResetButton } from './ResetButton'

export type ChecklistHeaderProps = { done: number; total: number; onReset?: () => void }

const barHeight = 4

export const ChecklistHeader = ({ done, total, onReset }: ChecklistHeaderProps) => {
  const { colors } = useTheme()
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)
  return (
    <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md, gap: spacing.sm }}>
      <Text variant="h3" accessibilityRole="header">
        Deine nächsten Schritte
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: spacing.md, rowGap: spacing.sm }}>
        <Text variant="bodySm" color="inkMuted">
          {`${done} von ${total} erledigt`}
        </Text>
        {onReset ? <ResetButton onPress={onReset} /> : null}
      </View>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ height: barHeight, borderRadius: barHeight / 2, backgroundColor: colors.line, overflow: 'hidden' }}
      >
        <Animated.View
          layout={LinearTransition.duration(250)}
          style={{ width: `${percent}%`, height: barHeight, backgroundColor: colors.ink }}
        />
      </View>
    </View>
  )
}
