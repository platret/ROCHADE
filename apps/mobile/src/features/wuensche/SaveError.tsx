import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import { Card } from '@/ui/Card'
import { Icon } from '@/ui/Icon'
import { Text } from '@/ui/Text'

export type SaveErrorProps = { message: string }

export const SaveError = ({ message }: SaveErrorProps) => (
  <Card accessibilityRole="alert" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
    <Icon name="exclamationmark.triangle.fill" size={20} color="danger" />
    <View style={{ flex: 1, gap: spacing.xs }}>
      <Text weight={600} color="danger">
        Speichern hat nicht geklappt.
      </Text>
      <Text variant="caption" color="inkMuted">
        {message}
      </Text>
    </View>
  </Card>
)
