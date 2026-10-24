import {
  addDays,
  daysBetween,
  demoFlats,
  demoHouseholds,
  demoIds,
  demoPhases,
  initials,
  type AssignmentStatus,
  type Household,
  type ISODate,
  type Phase,
  type PlannedAssignment,
} from '@rochade/shared'
import { demoProjectData, shiftPhases } from '../lib/demoPlan'

export const axisStart: ISODate = '2027-03-01'
export const axisEnd: ISODate = '2027-12-31'
export const shiftDays = 14
const axisDays = daysBetween(axisStart, axisEnd) + 1
const rowNames = ['Frau Meier', 'Herr Brunner', 'Frau Gerber', 'Familie Steiner']

export const pct = (iso: ISODate) => (daysBetween(axisStart, iso) / axisDays) * 100
export const widthPct = (start: ISODate, end: ISODate) => ((daysBetween(start, end) + 1) / axisDays) * 100
export const months: ISODate[] = Array.from({ length: 10 }, (_, index) => `2027-${String(index + 3).padStart(2, '0')}-01`)

export type Stay = { start: ISODate; end: ISODate }
export type RowFrame = {
  id: string
  initials: string
  name: string
  status: AssignmentStatus
  moveOut: ISODate
  home: Stay
  away: Stay
  back: Stay
  tempLabel: string | null
  reason: string | null
}
export type Frame = { phases: Phase[]; rows: RowFrame[]; conflicts: number }

const rowFor = (household: Household, assignments: PlannedAssignment[]): RowFrame[] => {
  const assignment = assignments.find((candidate) => candidate.household_id === household.id)
  if (!assignment?.move_out || !assignment.move_back) return []
  const temp = demoFlats.find((flat) => flat.id === assignment.temp_flat_id)
  return [
    {
      id: household.id,
      initials: initials(household.name),
      name: household.name,
      status: assignment.status,
      moveOut: assignment.move_out,
      home: { start: axisStart, end: addDays(assignment.move_out, -1) },
      away: { start: assignment.move_out, end: assignment.move_back },
      back: { start: addDays(assignment.move_back, 1), end: axisEnd },
      tempLabel: temp?.label ?? null,
      reason: assignment.conflict_reason,
    },
  ]
}

const frameFor = (phases: Phase[]): Frame => {
  const { assignments } = demoProjectData(phases)
  const households = rowNames.flatMap((name) => demoHouseholds.filter((household) => household.name === name))
  const rows = households.flatMap((household) => rowFor(household, assignments))
  return { phases, rows, conflicts: assignments.filter((assignment) => assignment.status === 'conflict').length }
}

export const frames = { before: frameFor(demoPhases), after: frameFor(shiftPhases(demoPhases, demoIds.phase3, shiftDays)) }

const findRow = (frame: Frame, id: string) => frame.rows.find((row) => row.id === id)
export const brunner = { before: findRow(frames.before, demoIds.brunner), after: findRow(frames.after, demoIds.brunner) }
