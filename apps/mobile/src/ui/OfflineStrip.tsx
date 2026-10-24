import { spacing } from '@rochade/shared'
import { formatTimestamp } from '@/lib/time'
import { Button } from './Button'
import { Card } from './Card'
import { Icon } from './Icon'
import { Text } from './Text'

export type OfflineStripProps = { updatedAt: Date; retry: () => void; retrying?: boolean }

export const OfflineStrip = ({ updatedAt, retry, retrying = false }: OfflineStripProps) => {
  const stamp = formatTimestamp(updatedAt)
  return (
    <Card
      tone="sunken"
      accessibilityLiveRegion="polite"
      style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs, paddingRight: spacing.xs }}
    >
      <Icon name="wifi.slash" size={18} color="inkMuted" />
      <Text variant="bodySm" accessibilityLabel={`Offline, Stand ${stamp}`} style={{ flex: 1 }}>
        {'Offline · Stand '}
        <Text variant="monoSm">{stamp}</Text>
      </Text>
      <Button
        variant="ghost"
        label="Erneut laden"
        onPress={retry}
        loading={retrying}
        style={{ minHeight: 44, paddingHorizontal: spacing.md }}
      />
    </Card>
  )
}
