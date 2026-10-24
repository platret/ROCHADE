import { formatDate, spacing, statusLabels, typeScale, type ColorName, type Flat } from '@rochade/shared'
import { View, type TextStyle } from 'react-native'
import { splitFlatLabel } from '@/lib/flats'
import { Text } from '@/ui/Text'
import { changeFieldLabels, flatLabelFor, isAssignmentStatus, type FieldChange } from './changes'

export type ChangeLineProps = { change: FieldChange; flats: Flat[] }

type ValueProps = { field: FieldChange['field']; value: string; flats: Flat[]; color: ColorName; previous?: boolean }

const strike: TextStyle = { textDecorationLine: 'line-through' }
const labelOffset = (typeScale.body.lineHeight - typeScale.label.lineHeight) / 2

const Value = ({ field, value, flats, color, previous = false }: ValueProps) => {
  const mono = previous ? 'monoSm' : 'mono'
  const sans = previous ? 'bodySm' : 'body'
  const weight = previous ? 400 : 600
  const style = previous ? strike : undefined
  if (field === 'status') {
    return (
      <Text variant={sans} weight={weight} color={color} style={style}>
        {isAssignmentStatus(value) ? statusLabels[value] : value}
      </Text>
    )
  }
  if (field === 'temp_flat_id') {
    const label = flatLabelFor(flats, value)
    if (label === null) {
      return (
        <Text variant={sans} color={color} style={style}>
          —
        </Text>
      )
    }
    const { prefix, number } = splitFlatLabel(label)
    return (
      <Text variant={sans} weight={weight} color={color} style={style}>
        {prefix}
        <Text variant={mono} color={color} style={style}>
          {number}
        </Text>
      </Text>
    )
  }
  return (
    <Text variant={mono} color={color} style={style}>
      {formatDate(value)}
    </Text>
  )
}

export const ChangeLine = ({ change, flats }: ChangeLineProps) => {
  const label = changeFieldLabels[change.field]
  if (change.field === 'conflict_reason') return <Text>{`${label}: ${change.to ?? '—'}`}</Text>
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        columnGap: spacing.md,
        rowGap: spacing.xs,
      }}
    >
      <Text variant="label" color="inkMuted" style={{ paddingTop: labelOffset }}>
        {label}
      </Text>
      <View style={{ alignItems: 'flex-end' }}>
        {change.to === null ? <Text color="inkMuted">—</Text> : <Value field={change.field} value={change.to} flats={flats} color="ink" />}
        {change.from !== null && (
          <Text variant="bodySm" color="inkMuted">
            {'vorher '}
            <Value field={change.field} value={change.from} flats={flats} color="inkMuted" previous />
          </Text>
        )}
      </View>
    </View>
  )
}
