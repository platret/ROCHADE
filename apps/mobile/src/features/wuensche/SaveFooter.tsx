import { gutter, spacing } from '@rochade/shared'
import { View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { SaveButton } from './SaveButton'
import { SaveError } from './SaveError'
import type { SavePhase } from './useWishesForm'

export type SaveFooterProps = {
  dirty: boolean
  phase: SavePhase
  error: string | null
  onSave: () => void
  bottomInset: number
}

export const SaveFooter = ({ dirty, phase, error, onSave, bottomInset }: SaveFooterProps) => {
  const { colors } = useTheme()
  return (
    <View
      style={{
        paddingHorizontal: gutter,
        paddingTop: spacing.md,
        paddingBottom: bottomInset + spacing.lg,
        gap: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.line,
        backgroundColor: colors.paper,
      }}
    >
      {error !== null && <SaveError message={error} />}
      <SaveButton dirty={dirty} phase={phase} onSave={onSave} />
    </View>
  )
}
