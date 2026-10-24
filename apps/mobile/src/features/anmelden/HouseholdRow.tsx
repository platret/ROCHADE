import type { Flat, Household } from '@rochade/shared'
import { splitFlatLabel } from '@/lib/flats'
import { RingCircle } from '@/ui/RingCircle'
import { TactileRow } from '@/ui/TactileRow'
import { Text } from '@/ui/Text'
import { BuildingBadge } from './BuildingBadge'

export type HouseholdRowProps = { household: Household; flat: Flat | null; initials: string; onPress: () => void }

export const HouseholdRow = ({ household, flat, initials, onPress }: HouseholdRowProps) => {
  const label = flat ? splitFlatLabel(flat.label) : null
  return (
    <TactileRow
      title={household.name}
      accessibilityLabel={label && flat ? `${household.name}, Wohnung ${label.number}, ${flat.building}` : household.name}
      leading={
        <RingCircle badge={flat ? <BuildingBadge building={flat.building} /> : null}>
          <Text weight={600}>{initials}</Text>
        </RingCircle>
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
