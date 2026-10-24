import { formatDate, statusLabels, type ColorName, type Flat } from '@rochade/shared'
import { splitFlatLabel } from '@/lib/flats'
import { Text } from '@/ui/Text'
import { changeFieldLabels, flatLabelFor, isAssignmentStatus, type FieldChange } from './changes'

export type ChangeLineProps = { change: FieldChange; flats: Flat[] }

type ValueProps = { field: FieldChange['field']; value: string | null; flats: Flat[]; color: ColorName }

const Value = ({ field, value, flats, color }: ValueProps) => {
  if (value === null) return <Text color={color}>—</Text>
  if (field === 'status') return <Text color={color}>{isAssignmentStatus(value) ? statusLabels[value] : value}</Text>
  if (field === 'temp_flat_id') {
    const label = flatLabelFor(flats, value)
    if (label === null) return <Text color={color}>—</Text>
    const { prefix, number } = splitFlatLabel(label)
    return (
      <Text color={color}>
        {prefix}
        <Text variant="mono" color={color}>
          {number}
        </Text>
      </Text>
    )
  }
  return (
    <Text variant="mono" color={color}>
      {formatDate(value)}
    </Text>
  )
}

export const ChangeLine = ({ change, flats }: ChangeLineProps) => {
  const label = changeFieldLabels[change.field]
  if (change.field === 'conflict_reason') return <Text>{`${label}: ${change.to ?? '—'}`}</Text>
  return (
    <Text>
      {`${label}: `}
      <Value field={change.field} value={change.from} flats={flats} color="inkMuted" />
      <Text color="inkMuted">{' → '}</Text>
      <Value field={change.field} value={change.to} flats={flats} color="ink" />
    </Text>
  )
}
