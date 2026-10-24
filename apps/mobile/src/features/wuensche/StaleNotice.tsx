import { spacing } from '@rochade/shared'
import { formatTimestamp } from '@/lib/time'
import { Card } from '@/ui/Card'
import { Icon } from '@/ui/Icon'
import { Text } from '@/ui/Text'

export type StaleNoticeProps = { updatedAt: Date }

export const StaleNotice = ({ updatedAt }: StaleNoticeProps) => (
  <Card
    tone="sunken"
    accessibilityLiveRegion="polite"
    style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md }}
  >
    <Icon name="wifi.exclamationmark" size={20} color="inkMuted" />
    <Text variant="bodySm" color="inkMuted" style={{ flex: 1 }}>
      {`Aktualisierung fehlgeschlagen. Angezeigt wird der Stand von ${formatTimestamp(updatedAt)}.`}
    </Text>
  </Card>
)
