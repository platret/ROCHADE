import type { ProjectData } from '@rochade/shared'
import { householdsByFlat } from '@/data/households'
import { householdInitials } from '@/lib/initials'
import { EmptyState } from '@/ui/EmptyState'
import { StaggerGroup } from '@/ui/StaggerGroup'
import { HouseholdRow } from './HouseholdRow'

export type HouseholdRowsProps = {
  data: ProjectData
  delay: number
  onSelect: (householdId: string) => void
  onReload: () => void
}

export const HouseholdRows = ({ data, delay, onSelect, onReload }: HouseholdRowsProps) => {
  const rows = householdsByFlat(data.households, data.flats)
  const initialsOf = householdInitials(data.households)
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
    <StaggerGroup delay={delay}>
      {rows.map(({ household, flat }) => (
        <HouseholdRow
          key={household.id}
          household={household}
          flat={flat}
          initials={initialsOf(household.id)}
          onPress={() => onSelect(household.id)}
        />
      ))}
    </StaggerGroup>
  )
}
