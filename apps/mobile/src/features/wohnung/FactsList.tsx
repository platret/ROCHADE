import { formatDate, gutter, spacing, type ISODate } from '@rochade/shared'
import { View } from 'react-native'
import { ListGroup } from '@/ui/ListGroup'
import { Text } from '@/ui/Text'
import { formatDays, stayDays, type WohnungPlan } from './plan'

type FactRowProps = { label: string; value: string | null; empty: string; mono?: boolean }

const FactRow = ({ label, value, empty, mono = false }: FactRowProps) => (
  <View
    accessible
    accessibilityRole="text"
    accessibilityLabel={`${label}: ${value ?? empty}`}
    style={{ minHeight: 64, justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.md, paddingHorizontal: spacing.lg }}
  >
    <Text variant="label" color="inkMuted">
      {label}
    </Text>
    <Text variant={value !== null && mono ? 'mono' : 'body'} weight={600} color={value === null ? 'inkMuted' : 'ink'}>
      {value ?? empty}
    </Text>
  </View>
)

export type FactsListProps = { plan: WohnungPlan }

const dateFallback = 'Termin folgt'

const dateOrNull = (date: ISODate | null) => (date ? formatDate(date) : null)

export const FactsList = ({ plan }: FactsListProps) => {
  const days = stayDays(plan)
  return (
    <ListGroup dividerInset={gutter}>
      <FactRow label="Auszug" value={dateOrNull(plan.moveOut)} empty={dateFallback} mono />
      <FactRow label="Rückkehr" value={dateOrNull(plan.moveBack)} empty={dateFallback} mono />
      <FactRow label="Dauer" value={days === null ? null : formatDays(days)} empty="Noch offen" />
    </ListGroup>
  )
}
