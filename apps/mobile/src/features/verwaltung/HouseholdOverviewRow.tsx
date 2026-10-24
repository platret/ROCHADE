import { spacing, type Period } from '@rochade/shared'
import { View } from 'react-native'
import { Badge } from '@/ui/Badge'
import { Flash } from '@/ui/Flash'
import { Icon } from '@/ui/Icon'
import { Text } from '@/ui/Text'
import { FlatLabel } from './inlineFacts'
import type { OverviewRow } from './overview'
import { describeRow, noHomeFlat, periodRange, tempFlatPending } from './rowText'

export type HouseholdOverviewRowProps = { row: OverviewRow; flashKey: number | null }

const HomeLine = ({ row }: { row: OverviewRow }) => (
  <Text variant="bodySm" color="inkMuted">
    {row.homeFlat ? (
      <>
        <FlatLabel label={row.homeFlat.label} />
        {` · ${row.homeFlat.building}`}
      </>
    ) : (
      noHomeFlat
    )}
  </Text>
)

const TempLine = ({ row }: { row: OverviewRow }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
    <Icon name="arrow.right" size={12} color="inkMuted" weight="semibold" />
    <Text variant="bodySm" color="inkMuted">
      {row.tempFlat ? <FlatLabel label={row.tempFlat.label} /> : tempFlatPending}
    </Text>
  </View>
)

const PeriodLine = ({ period }: { period: Period }) => (
  <Text variant="monoSm" color="inkMuted" style={{ fontVariant: ['tabular-nums'] }}>
    {periodRange(period)}
  </Text>
)

const ReasonLine = ({ reason }: { reason: string }) => (
  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs }}>
    <Icon name="exclamationmark.circle" size={14} color="danger" weight="semibold" style={{ marginTop: 3 }} />
    <Text variant="bodySm" color="inkMuted" style={{ flex: 1 }}>
      {reason}
    </Text>
  </View>
)

export const HouseholdOverviewRow = ({ row, flashKey }: HouseholdOverviewRowProps) => (
  <Flash flashKey={flashKey}>
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={describeRow(row)}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
      }}
    >
      <View style={{ flex: 1, gap: spacing.xs }}>
        <Text weight={600}>{row.household.name}</Text>
        <HomeLine row={row} />
        {row.status === 'ok' && <TempLine row={row} />}
        {row.status === 'ok' && row.period && <PeriodLine period={row.period} />}
        {row.status === 'conflict' && row.reason && <ReasonLine reason={row.reason} />}
      </View>
      <Badge status={row.status} />
    </View>
  </Flash>
)
