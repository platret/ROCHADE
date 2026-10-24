import { formatTimestamp } from '@/lib/time'
import { Text } from './Text'

export type StandLineProps = { updatedAt: Date; busy?: boolean }

const monoCaption = { fontSize: 12, lineHeight: 16 }

export const StandLine = ({ updatedAt, busy = false }: StandLineProps) => {
  const stamp = formatTimestamp(updatedAt)
  return (
    <Text variant="caption" color="inkMuted" accessibilityLabel={busy ? 'Aktualisiere' : `Stand ${stamp}`}>
      {busy ? (
        'Aktualisiere …'
      ) : (
        <>
          {'Stand '}
          <Text variant="monoSm" color="inkMuted" style={monoCaption}>
            {stamp}
          </Text>
        </>
      )}
    </Text>
  )
}
