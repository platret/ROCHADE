import { roomsLabel, spacing, type Household } from '@rochade/shared'
import { View } from 'react-native'
import { ListGroup } from '@/ui/ListGroup'
import { Stagger } from '@/ui/Stagger'
import { useEntered } from '@/ui/useEntered'
import { stepFreeLabel } from './needs'
import { SummaryFooter } from './SummaryFooter'
import { summaryDividerInset, SummaryRow, type SummaryRowProps } from './SummaryRow'

export type WishesSummaryProps = { household: Household }

const rowsFor = (household: Household): SummaryRowProps[] => [
  { symbol: 'bed.double', label: 'Anzahl Zimmer', value: roomsLabel(household.needs_rooms) },
  { symbol: 'figure.roll', label: 'Hindernisfreie Wohnung', value: stepFreeLabel(household.needs_step_free) },
  { symbol: 'graduationcap', label: 'Schulkreis', value: household.school_district },
  { symbol: 'note.text', label: 'Notiz', value: household.note, empty: 'Keine Notiz', prose: true },
]

export const WishesSummary = ({ household }: WishesSummaryProps) => {
  const entered = useEntered()
  const rows = rowsFor(household)
  return (
    <View style={{ gap: spacing.xl }}>
      <ListGroup dividerInset={summaryDividerInset}>
        {rows.map((row, index) => (
          <Stagger key={row.label} index={index} play={entered}>
            <SummaryRow {...row} />
          </Stagger>
        ))}
      </ListGroup>
      <Stagger index={rows.length} play={entered}>
        <SummaryFooter />
      </Stagger>
    </View>
  )
}
