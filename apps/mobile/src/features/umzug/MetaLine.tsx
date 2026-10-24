import { formatTimestamp } from '@/lib/time'
import { Text } from '@/ui/Text'

export type MetaLineProps = { updatedAt: Date }

export const MetaLine = ({ updatedAt }: MetaLineProps) => {
  const stamp = formatTimestamp(updatedAt)
  return (
    <Text variant="caption" color="inkMuted" accessibilityLabel={`Stand ${stamp}`}>
      {'Stand '}
      <Text variant="monoSm" color="inkMuted">
        {stamp}
      </Text>
    </Text>
  )
}
