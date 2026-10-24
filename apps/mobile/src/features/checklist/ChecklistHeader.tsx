import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import { ProgressBar } from '@/ui/ProgressBar'
import { Text } from '@/ui/Text'
import { ResetButton } from './ResetButton'

export type ChecklistHeaderProps = { done: number; total: number; onReset?: () => void }

export const ChecklistHeader = ({ done, total, onReset }: ChecklistHeaderProps) => (
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
    <ProgressBar value={total === 0 ? 0 : done / total} />
  </View>
)
