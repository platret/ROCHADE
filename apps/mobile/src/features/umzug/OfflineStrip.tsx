import { spacing } from '@rochade/shared'
import { formatTimestamp } from '@/lib/time'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { Icon } from '@/ui/Icon'
import { Text } from '@/ui/Text'

export type OfflineStripProps = { updatedAt: Date; retry: () => void }

export const OfflineStrip = ({ updatedAt, retry }: OfflineStripProps) => (
  <Card
    tone="sunken"
    accessibilityLiveRegion="polite"
    style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, paddingRight: spacing.sm }}
  >
    <Icon name="wifi.slash" size={18} color="inkMuted" />
    <Text variant="bodySm" style={{ flex: 1 }}>
      {'Offline – Stand '}
      <Text variant="monoSm">{formatTimestamp(updatedAt)}</Text>
    </Text>
    <Button variant="ghost" label="Erneut versuchen" onPress={retry} style={{ minHeight: 44, paddingHorizontal: spacing.md }} />
  </Card>
)
