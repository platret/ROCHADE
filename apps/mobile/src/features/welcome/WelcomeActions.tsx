import { spacing } from '@rochade/shared'
import Animated from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button } from '@/ui/Button'
import { riseIn } from '@/ui/entering'
import { backToCode } from './route'

export type WelcomeActionsProps = { confirmLabel: string; onConfirm: () => void; delay: number }

export const WelcomeActions = ({ confirmLabel, onConfirm, delay }: WelcomeActionsProps) => {
  const insets = useSafeAreaInsets()
  return (
    <Animated.View
      entering={riseIn(delay)}
      style={{ marginTop: 'auto', paddingTop: spacing.xl, paddingBottom: insets.bottom + spacing.sm, gap: spacing.sm }}
    >
      <Button label={confirmLabel} onPress={onConfirm} />
      <Button label="Das bin ich nicht" variant="ghost" onPress={backToCode} accessibilityLabel="Das bin ich nicht, Code erneut eingeben" />
    </Animated.View>
  )
}
