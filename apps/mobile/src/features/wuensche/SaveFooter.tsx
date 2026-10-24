import { gutter, spacing } from '@rochade/shared'
import { View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { Button } from '@/ui/Button'
import { SaveError } from './SaveError'
import type { SavePhase } from './useWishesForm'

export type SaveFooterProps = {
  dirty: boolean
  phase: SavePhase
  error: string | null
  onSave: () => void
  bottomInset: number
}

const noop = () => undefined

export const SaveFooter = ({ dirty, phase, error, onSave, bottomInset }: SaveFooterProps) => {
  const { colors } = useTheme()
  const saved = phase === 'saved'
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
      <Button
        label={saved ? 'Gespeichert' : 'Speichern'}
        icon={saved ? 'checkmark' : undefined}
        loading={phase === 'saving'}
        disabled={!dirty && phase === 'idle'}
        onPress={saved ? noop : onSave}
      />
    </View>
  )
}
