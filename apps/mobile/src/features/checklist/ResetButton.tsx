import { spacing } from '@rochade/shared'
import { Button } from '@/ui/Button'

export type ResetButtonProps = { onPress: () => void }

const hitHeight = 44

export const ResetButton = ({ onPress }: ResetButtonProps) => (
  <Button
    variant="ghost"
    label="Zurücksetzen"
    accessibilityLabel="Checkliste zurücksetzen"
    onPress={onPress}
    style={{
      minHeight: hitHeight,
      paddingHorizontal: spacing.md,
      marginVertical: -spacing.sm,
      marginLeft: 'auto',
      marginRight: -spacing.md,
    }}
  />
)
