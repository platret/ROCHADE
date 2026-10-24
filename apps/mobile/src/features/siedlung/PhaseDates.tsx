import { formatDate, spacing, type ISODate } from '@rochade/shared'
import { View } from 'react-native'
import { Icon } from '@/ui/Icon'
import { Text } from '@/ui/Text'

type DateColumnProps = { label: string; date: ISODate; previous?: ISODate }

const DateColumn = ({ label, date, previous }: DateColumnProps) => (
  <View style={{ flex: 1, gap: spacing.xs }}>
    <Text variant="label" color="inkMuted">
      {label}
    </Text>
    {previous !== undefined && (
      <Text
        variant="monoSm"
        color="inkMuted"
        numberOfLines={1}
        style={{ textDecorationLine: 'line-through', opacity: previous === date ? 0 : 1 }}
      >
        {formatDate(previous)}
      </Text>
    )}
    <Text variant="mono" numberOfLines={1}>
      {formatDate(date)}
    </Text>
  </View>
)

export type PhaseDatesProps = { start: ISODate; end: ISODate; previousStart?: ISODate; previousEnd?: ISODate }

export const PhaseDates = ({ start, end, previousStart, previousEnd }: PhaseDatesProps) => (
  <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm }}>
    <DateColumn label="Beginn" date={start} previous={previousStart} />
    <Icon name="arrow.right" size={16} color="lineStrong" style={{ marginBottom: spacing.xs }} />
    <DateColumn label="Ende" date={end} previous={previousEnd} />
  </View>
)
