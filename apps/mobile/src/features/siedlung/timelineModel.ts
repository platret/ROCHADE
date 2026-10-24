import { addDays, daysBetween, monthStart, timelineColors, type Assignment, type ColorName, type ISODate, type Phase } from '@rochade/shared'

export type TimelineRange = { start: ISODate; end: ISODate; months: ISODate[] }

export type SegmentKind = 'home' | 'temp' | 'renovated' | 'conflict'

export type SegmentLook = { fill: ColorName | null; outline: ColorName | null; dashed: boolean }

export const segmentLooks: Record<SegmentKind, SegmentLook> = {
  home: { fill: timelineColors.home, outline: null, dashed: false },
  temp: { fill: timelineColors.temp, outline: null, dashed: false },
  renovated: { fill: null, outline: timelineColors.renovatedOutline, dashed: false },
  conflict: { fill: null, outline: timelineColors.conflictOutline, dashed: true },
}

export const moveDayColor: ColorName = timelineColors.moveDay

export type TimelineSegment = { kind: SegmentKind; start: ISODate; end: ISODate }

export type Scale = (iso: ISODate) => number

const nextMonth = (month: ISODate) => monthStart(addDays(month, 31))

const earliest = (dates: ISODate[]) => dates.reduce((a, b) => (a < b ? a : b))

const latest = (dates: ISODate[]) => dates.reduce((a, b) => (a > b ? a : b))

export const timelineRange = (phases: Phase[], assignments: Assignment[]): TimelineRange | null => {
  if (phases.length === 0) return null
  const start = monthStart(earliest(phases.map((phase) => phase.start_date)))
  const moveBacks = assignments.flatMap((assignment) => (assignment.move_back ? [assignment.move_back] : []))
  const last = latest([...phases.map((phase) => phase.end_date), ...moveBacks])
  const end = nextMonth(nextMonth(monthStart(last)))
  const months: ISODate[] = []
  for (let month = start; month < end; month = nextMonth(month)) months.push(month)
  return { start, end, months }
}

export const lastMonth = (range: TimelineRange) => range.months[range.months.length - 1] ?? range.start

export const scaleFor = (range: TimelineRange, width: number): Scale => {
  const total = daysBetween(range.start, range.end)
  return (iso) => (daysBetween(range.start, iso) / total) * width
}

export const clampToRange = (segment: TimelineSegment, range: TimelineRange): TimelineSegment | null => {
  const start = segment.start > range.start ? segment.start : range.start
  const end = segment.end < range.end ? segment.end : range.end
  return start < end ? { ...segment, start, end } : null
}
