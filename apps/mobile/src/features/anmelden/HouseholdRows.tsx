import type { ProjectData } from '@rochade/shared'
import { householdsByFlat } from '@/data/households'
import { EmptyState } from '@/ui/EmptyState'
import { ListGroup } from '@/ui/ListGroup'
import { HouseholdRow } from './HouseholdRow'

export type HouseholdRowsProps = {
  data: ProjectData
  onSelect: (householdId: string) => void
  onReload: () => void
}

export const HouseholdRows = ({ data, onSelect, onReload }: HouseholdRowsProps) => {
  const rows = householdsByFlat(data.households, data.flats)
  if (rows.length === 0) {
    return (
      <EmptyState
        symbol="house"
        title="Keine Haushalte gefunden"
        body="Die Demo-Daten sind noch nicht eingerichtet."
        action={{ label: 'Erneut laden', onPress: onReload }}
      />
    )
  }
  return (
    <ListGroup>
      {rows.map(({ household, flat }) => (
        <HouseholdRow key={household.id} household={household} flat={flat} onPress={() => onSelect(household.id)} />
      ))}
    </ListGroup>
  )
}
