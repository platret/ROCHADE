import { spacing } from '@rochade/shared'
import { router } from 'expo-router'
import { View } from 'react-native'
import { Button } from '@/ui/Button'
import { Text } from '@/ui/Text'

export type SummaryFooterProps = { disabled?: boolean }

export const SummaryFooter = ({ disabled = false }: SummaryFooterProps) => (
  <View style={{ gap: spacing.md }}>
    <Button label="Wünsche bearbeiten" disabled={disabled} onPress={() => router.push('/wuensche-bearbeiten')} />
    <Text variant="bodySm" color="inkMuted">
      Die Verwaltung berücksichtigt deine Wünsche nach Möglichkeit bei der Zuteilung.
    </Text>
  </View>
)
