import { formatDate, formatFloor, type Flat, type Household, type ISODate } from '@rochade/shared'
import { TriangleAlert } from 'lucide-react'
import type { AssignmentRow } from '../lib/assignmentRows'
import { StatusBadge } from './StatusBadge'

const dash = '—'
const cell = 'px-4 py-3 align-top'
const mono = `${cell} font-mono whitespace-nowrap`

const needs = ({ needs_rooms, needs_step_free }: Household) => `${needs_rooms} Zimmer${needs_step_free ? ' · hindernisfrei' : ''}`
const members = (count: number) => `${count} ${count === 1 ? 'Person' : 'Personen'}`
const date = (iso: ISODate | null | undefined) => (iso ? formatDate(iso) : dash)

const FlatCell = ({ flat, withFloor = false }: { flat: Flat | null; withFloor?: boolean }) =>
  flat ? (
    <>
      <div className="font-mono whitespace-nowrap">{flat.label}</div>
      <div className="text-ink-muted">{withFloor ? `${flat.building} · ${formatFloor(flat.floor)}` : flat.building}</div>
    </>
  ) : (
    dash
  )

export const AssignmentTableRow = ({ row: { household, home, assignment, temp } }: { row: AssignmentRow }) => (
  <tr className="border-t border-line">
    <td className={cell}>
      <div className="font-semibold">{household.name}</div>
      <div className="text-ink-muted">{members(household.members)}</div>
      {assignment?.status === 'conflict' && assignment.conflict_reason && (
        <div className="mt-1 flex max-w-xs items-start gap-1 text-body-sm text-danger">
          <TriangleAlert size={16} className="shrink-0" />
          {assignment.conflict_reason}
        </div>
      )}
    </td>
    <td className={cell}>
      <FlatCell flat={home} />
    </td>
    <td className={cell}>{needs(household)}</td>
    <td className={cell}>
      <FlatCell flat={temp} withFloor />
    </td>
    <td className={mono}>{date(assignment?.move_out)}</td>
    <td className={mono}>{date(assignment?.move_back)}</td>
    <td className={cell}>
      <StatusBadge status={assignment?.status ?? 'open'} />
    </td>
  </tr>
)
