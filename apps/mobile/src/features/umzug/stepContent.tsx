import { formatDate, formatFloor, roomsLabel, spacing, type Flat, type ISODate } from '@rochade/shared'
import { View } from 'react-native'
import { splitFlatLabel } from '@/lib/flats'
import { Chip } from '@/ui/Chip'
import { Text } from '@/ui/Text'

export type DateHeroProps = { date: ISODate | null; fallback: string }

export const DateHero = ({ date, fallback }: DateHeroProps) =>
  date ? (
    <Text variant="monoLarge">{formatDate(date)}</Text>
  ) : (
    <Text weight={600} color="inkMuted">
      {fallback}
    </Text>
  )

export const FlatHero = ({ flat }: { flat: Flat }) => {
  const { prefix, number } = splitFlatLabel(flat.label)
  return (
    <Text variant="h2" weight={600}>
      {prefix}
      <Text variant="monoLarge">{number}</Text>
    </Text>
  )
}

export const flatPlace = (flat: Flat) => `${flat.building} · ${formatFloor(flat.floor)}`

export type FlatChipsProps = { flat: Flat; schoolDistrict?: boolean }

export const FlatChips = ({ flat, schoolDistrict = false }: FlatChipsProps) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs }}>
    {flat.step_free && <Chip label="hindernisfrei" symbol="figure.roll" />}
    <Chip label={roomsLabel(flat.rooms)} />
    {schoolDistrict && flat.school_district !== null && <Chip label={`Schulkreis ${flat.school_district}`} symbol="graduationcap" />}
  </View>
)

export const ReturnLine = ({ homeFlat }: { homeFlat: Flat | null }) => {
  if (!homeFlat) return <Text color="inkMuted">zurück in deine Wohnung</Text>
  const { prefix, number } = splitFlatLabel(homeFlat.label)
  return (
    <Text color="inkMuted">
      {`zurück in ${prefix}`}
      <Text variant="mono" color="inkMuted">
        {number}
      </Text>
    </Text>
  )
}
