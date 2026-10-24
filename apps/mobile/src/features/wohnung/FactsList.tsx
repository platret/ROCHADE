import { formatDate, gutter, spacing, todayIso, type ISODate } from '@rochade/shared'
import type { SFSymbol } from 'expo-symbols'
import type { ReactNode } from 'react'
import { View } from 'react-native'
import { Icon } from '@/ui/Icon'
import { ListGroup } from '@/ui/ListGroup'
import { ProgressBar } from '@/ui/ProgressBar'
import { Text } from '@/ui/Text'
import { formatDays, formatStayProgress, stayDays, stayProgress, type WohnungPlan } from './plan'

type FactRowProps = {
  symbol: SFSymbol
  label: string
  value: string | null
  empty: string
  mono?: boolean
  detail?: string
  children?: ReactNode
}

const FactRow = ({ symbol, label, value, empty, mono = false, detail, children }: FactRowProps) => (
  <View
    accessible
    accessibilityRole="text"
    accessibilityLabel={`${label}: ${value ?? empty}${detail ? `, ${detail}` : ''}`}
    style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, paddingHorizontal: spacing.lg }}
  >
    <Icon name={symbol} size={20} color="inkMuted" />
    <Text variant="label" color="inkMuted" style={{ flex: 1 }}>
      {label}
    </Text>
    <View style={{ flexShrink: 1, alignItems: 'flex-end', gap: spacing.xs }}>
      <Text variant={value !== null && mono ? 'mono' : 'body'} weight={600} color={value === null ? 'inkMuted' : 'ink'} align="right">
        {value ?? empty}
      </Text>
      {children}
    </View>
  </View>
)

export type FactsListProps = { plan: WohnungPlan }

const dateFallback = 'Termin folgt'
const inlineBarWidth = 96

const dateOrNull = (date: ISODate | null) => (date ? formatDate(date) : null)

export const FactsList = ({ plan }: FactsListProps) => {
  const days = stayDays(plan)
  const progress = stayProgress(plan, todayIso())
  return (
    <ListGroup dividerInset={gutter}>
      <FactRow symbol="door.left.hand.open" label="Auszug" value={dateOrNull(plan.moveOut)} empty={dateFallback} mono />
      <FactRow symbol="calendar" label="Rückkehr" value={dateOrNull(plan.moveBack)} empty={dateFallback} mono />
      <FactRow
        symbol="clock"
        label="Dauer"
        value={days === null ? null : formatDays(days)}
        empty="Noch offen"
        detail={progress ? formatStayProgress(progress) : undefined}
      >
        {progress && (
          <>
            <ProgressBar value={progress.elapsed / progress.total} width={inlineBarWidth} />
            <Text variant="caption" color="inkMuted" align="right">
              {formatStayProgress(progress)}
            </Text>
          </>
        )}
      </FactRow>
    </ListGroup>
  )
}
