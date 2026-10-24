import type { Flat, Household } from '@rochade/shared'
import { splitFlatLabel } from '@/lib/flats'
import { LeadingCircle } from '@/ui/LeadingCircle'
import { ListRow } from '@/ui/ListRow'
import { Text } from '@/ui/Text'

export type HouseholdRowProps = { household: Household; flat: Flat | null; initials: string; onPress: () => void }

export const HouseholdRow = ({ household, flat, initials, onPress }: HouseholdRowProps) => {
  const label = flat ? splitFlatLabel(flat.label) : null
  return (
    <ListRow
      title={household.name}
      accessibilityLabel={label && flat ? `${household.name}, Wohnung ${label.number}, ${flat.building}` : household.name}
      leading={
        <LeadingCircle>
          <Text weight={600}>{initials}</Text>
        </LeadingCircle>
      }
      subtitle={
        label && flat ? (
          <>
            {label.prefix}
            <Text variant="monoSm" color="inkMuted">
              {label.number}
            </Text>
            {` · ${flat.building}`}
          </>
        ) : (
          'Ohne eigene Wohnung'
        )
      }
      onPress={onPress}
    />
  )
}
