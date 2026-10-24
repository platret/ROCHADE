import { addDays, formatDate, type Assignment, type ISODate, type ProjectData } from '@rochade/shared'
import { householdsByFlat } from '@/data/households'
import { householdInitials } from '@/lib/initials'
import { clampToRange, type SegmentKind, type TimelineRange, type TimelineSegment } from './timelineModel'

export type TimelineRow = {
  id: string
  initials: string
  own: boolean
  conflict: boolean
  moveOut: ISODate | null
  moveBack: ISODate | null
  segments: TimelineSegment[]
  summary: string
}

type Planned = Assignment & { move_out: ISODate; move_back: ISODate }

const isPlanned = (assignment: Assignment | undefined): assignment is Planned =>
  assignment !== undefined && assignment.status !== 'open' && assignment.move_out !== null && assignment.move_back !== null

const returnDay = (assignment: Planned) => addDays(assignment.move_back, 1)

const segmentsFor = (assignment: Assignment | undefined, range: TimelineRange): TimelineSegment[] => {
  if (!isPlanned(assignment)) return []
  const back = returnDay(assignment)
  const kind: SegmentKind = assignment.status === 'conflict' ? 'conflict' : 'temp'
  const segments: TimelineSegment[] = [
    { kind, start: assignment.move_out, end: back },
    { kind: 'renovated', start: back, end: range.end },
  ]
  return segments.flatMap((segment) => {
    const clamped = clampToRange(segment, range)
    return clamped ? [clamped] : []
  })
}

const summaryFor = (who: string, assignment: Assignment | undefined) => {
  if (!assignment || assignment.status === 'open') return `${who}: noch nicht zugeteilt.`
  if (assignment.status === 'conflict') {
    return isPlanned(assignment)
      ? `${who}: Konflikt vom ${formatDate(assignment.move_out)} bis ${formatDate(assignment.move_back)}, die Rochade-Wohnung fehlt noch.`
      : `${who}: Konflikt, die Rochade-Wohnung fehlt noch.`
  }
  return isPlanned(assignment)
    ? `${who}: Umzug am ${formatDate(assignment.move_out)} in die Rochade-Wohnung, Rückzug am ${formatDate(assignment.move_back)}.`
    : `${who}: Termine folgen.`
}

export const timelineRows = (data: ProjectData, range: TimelineRange, ownHouseholdId: string | null): TimelineRow[] => {
  const assignmentByHousehold = new Map(data.assignments.map((assignment) => [assignment.household_id, assignment]))
  const initialsOf = householdInitials(data.households)
  const households = householdsByFlat(data.households, data.flats).map(({ household }) => household)
  const own = households.filter((household) => household.id === ownHouseholdId)
  const others = households.filter((household) => household.id !== ownHouseholdId)
  return [...own, ...others].map((household) => {
    const assignment = assignmentByHousehold.get(household.id)
    const isOwn = household.id === ownHouseholdId
    const label = initialsOf(household.id)
    return {
      id: household.id,
      initials: label,
      own: isOwn,
      conflict: assignment?.status === 'conflict',
      moveOut: isPlanned(assignment) ? assignment.move_out : null,
      moveBack: isPlanned(assignment) && assignment.status === 'ok' ? returnDay(assignment) : null,
      segments: segmentsFor(assignment, range),
      summary: summaryFor(isOwn ? 'Dein Haushalt' : `Haushalt ${label}`, assignment),
    }
  })
}
