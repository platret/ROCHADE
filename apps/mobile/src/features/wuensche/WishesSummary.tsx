import { gutter, spacing, type Household } from '@rochade/shared'
import { View } from 'react-native'
import { ListGroup } from '@/ui/ListGroup'
import { roomsLabel, stepFreeLabel } from './needs'
import { SummaryFooter } from './SummaryFooter'
import { SummaryRow } from './SummaryRow'

export type WishesSummaryProps = { household: Household }

export const WishesSummary = ({ household }: WishesSummaryProps) => (
  <View style={{ gap: spacing.xl }}>
    <ListGroup dividerInset={gutter}>
      <SummaryRow label="Anzahl Zimmer" value={roomsLabel(household.needs_rooms)} />
      <SummaryRow label="Hindernisfreie Wohnung" value={stepFreeLabel(household.needs_step_free)} />
      <SummaryRow label="Schulkreis" value={household.school_district} />
      <SummaryRow label="Notiz" value={household.note} empty="Keine Notiz" prose />
    </ListGroup>
    <SummaryFooter />
  </View>
)
