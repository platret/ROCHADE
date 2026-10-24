import { formatDate, type Period } from '@rochade/shared'
import { Badge } from '@/ui/Badge'
import { Flash } from '@/ui/Flash'
import { ListRow } from '@/ui/ListRow'
import { Text } from '@/ui/Text'
import { FlatLabel, Mono } from './inlineFacts'
import type { OverviewRow } from './overview'
import { describeRow, noHomeFlat, tempFlatPending } from './rowText'

export type HouseholdOverviewRowProps = { row: OverviewRow; flashKey: number | null }

const PeriodText = ({ period }: { period: Period }) => (
  <>
    <Mono>{formatDate(period.start)}</Mono>
    {' bis '}
    <Mono>{formatDate(period.end)}</Mono>
  </>
)

const HomeLine = ({ row }: { row: OverviewRow }) =>
  row.homeFlat ? (
    <>
      <FlatLabel label={row.homeFlat.label} />
      {` · ${row.homeFlat.building}`}
    </>
  ) : (
    noHomeFlat
  )

const DetailLine = ({ row }: { row: OverviewRow }) => {
  if (row.status === 'conflict') {
    return row.reason ? (
      <Text variant="bodySm" color="ink">
        {`\n${row.reason}`}
      </Text>
    ) : null
  }
  if (row.status !== 'ok') return null
  return (
    <>
      {'\n→ '}
      {row.tempFlat ? <FlatLabel label={row.tempFlat.label} /> : tempFlatPending}
      {row.period && (
        <>
          {'\n'}
          <PeriodText period={row.period} />
        </>
      )}
    </>
  )
}

export const HouseholdOverviewRow = ({ row, flashKey }: HouseholdOverviewRowProps) => (
  <Flash flashKey={flashKey}>
    <ListRow
      title={row.household.name}
      accessibilityLabel={describeRow(row)}
      subtitle={
        <>
          <HomeLine row={row} />
          <DetailLine row={row} />
        </>
      }
      trailing={<Badge status={row.status} />}
    />
  </Flash>
)
