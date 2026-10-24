import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import { householdCountLabel } from '@/lib/phases'
import { ListGroup } from '@/ui/ListGroup'
import { SectionHeader } from '@/ui/SectionHeader'
import { Stagger } from '@/ui/Stagger'
import { HouseholdOverviewRow } from './HouseholdOverviewRow'
import type { OverviewRow } from './overview'

export type HouseholdListProps = { rows: OverviewRow[]; flashAt: ReadonlyMap<string, number> }

const rowStepMs = 40

export const HouseholdList = ({ rows, flashAt }: HouseholdListProps) => (
  <View style={{ gap: spacing.md }}>
    <SectionHeader title="Haushalte" meta={householdCountLabel(rows.length)} />
    <ListGroup dividerInset={spacing.lg}>
      {rows.map((row, index) => (
        <Stagger key={row.household.id} index={index} step={rowStepMs}>
          <HouseholdOverviewRow row={row} flashKey={flashAt.get(row.household.id) ?? null} />
        </Stagger>
      ))}
    </ListGroup>
  </View>
)
