import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import { householdCountLabel } from '@/lib/phases'
import { ListGroup } from '@/ui/ListGroup'
import { SectionHeader } from '@/ui/SectionHeader'
import { HouseholdOverviewRow } from './HouseholdOverviewRow'
import type { OverviewRow } from './overview'

export type HouseholdListProps = { rows: OverviewRow[]; flashAt: ReadonlyMap<string, number> }

export const HouseholdList = ({ rows, flashAt }: HouseholdListProps) => (
  <View style={{ gap: spacing.md }}>
    <SectionHeader title="Haushalte" meta={householdCountLabel(rows.length)} />
    <ListGroup dividerInset={spacing.lg}>
      {rows.map((row) => (
        <HouseholdOverviewRow key={row.household.id} row={row} flashKey={flashAt.get(row.household.id) ?? null} />
      ))}
    </ListGroup>
  </View>
)
