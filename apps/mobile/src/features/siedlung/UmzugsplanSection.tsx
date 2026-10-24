import { formatMonthShort, spacing, type ISODate, type ProjectData } from '@rochade/shared'
import { View } from 'react-native'
import { householdCountLabel, runningPhase } from '@/lib/phases'
import { SectionHeader } from '@/ui/SectionHeader'
import { Text } from '@/ui/Text'
import { Legend } from './Legend'
import { Timeline } from './Timeline'
import { lastMonth, timelineRange } from './timelineModel'
import { timelineRows } from './timelineRows'

export type UmzugsplanSectionProps = { data: ProjectData; ownHouseholdId: string | null; today: ISODate }

const yearsOf = (first: ISODate, last: ISODate) => [...new Set([first.slice(0, 4), last.slice(0, 4)])].join('–')

export const UmzugsplanSection = ({ data, ownHouseholdId, today }: UmzugsplanSectionProps) => {
  const range = timelineRange(data.phases, data.assignments)
  if (!range) return null
  const last = lastMonth(range)
  const rows = timelineRows(data, range, ownHouseholdId)
  const planned = data.assignments.length > 0 && rows.length > 0
  return (
    <View style={{ gap: spacing.lg, marginTop: spacing.sm }}>
      <SectionHeader
        title={`Umzugsplan ${yearsOf(range.start, last)}`}
        subtitle={`${householdCountLabel(rows.length)}, ${formatMonthShort(range.start)} bis ${formatMonthShort(last)}`}
      />
      {planned ? (
        <>
          <Timeline rows={rows} range={range} runningPhase={runningPhase(data.phases, today)} />
          <Legend showConflict={rows.some((row) => row.conflict)} highlightOwn={rows.some((row) => row.own)} />
        </>
      ) : (
        <Text variant="bodySm" color="inkMuted">
          Der Umzugsplan folgt, sobald alle Haushalte zugeteilt sind.
        </Text>
      )}
    </View>
  )
}
