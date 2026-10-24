import { addDays, radius, spacing, type ISODate, type Phase } from '@rochade/shared'
import { useState } from 'react'
import { View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { useEntered } from '@/ui/useEntered'
import { useOnScreen } from '@/ui/useOnScreen'
import { TimelineAxis } from './TimelineAxis'
import { timelineLayout } from './timelineLayout'
import { scaleFor, type TimelineRange } from './timelineModel'
import { TimelineRow } from './TimelineRow'
import { timelineShape, type TimelineRow as Row } from './timelineRows'
import { TodayMarker } from './TodayMarker'

export type TimelineProps = { rows: Row[]; range: TimelineRange; runningPhase: Phase | null; today: ISODate }

const { labelWidth, columnGap, axisHeight, rowPitch, todayRowHeight } = timelineLayout

export const Timeline = ({ rows, range, runningPhase, today }: TimelineProps) => {
  const { colors } = useTheme()
  const entered = useEntered()
  const { ref, visible } = useOnScreen(entered)
  const [plotWidth, setPlotWidth] = useState(0)
  const measured = plotWidth > 0
  const scale = scaleFor(range, plotWidth)
  const gridlines = [...range.months, range.end].map((month) => Math.min(scale(month), Math.max(plotWidth - 1, 0)))
  const todayInRange = today >= range.start && today < range.end
  const shape = timelineShape(rows, range)
  return (
    <View ref={ref} collapsable={false}>
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: axisHeight + spacing.xs, bottom: 0, left: labelWidth + columnGap, right: 0 }}
      >
        {runningPhase && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: scale(runningPhase.start_date),
              width: scale(addDays(runningPhase.end_date, 1)) - scale(runningPhase.start_date),
              borderRadius: radius.sm,
              backgroundColor: colors.surfaceSunken,
            }}
          />
        )}
        {gridlines.map((left, index) => (
          <View key={index} style={{ position: 'absolute', top: 0, bottom: 0, left, width: 1, backgroundColor: colors.line, opacity: 0.5 }} />
        ))}
        {measured && todayInRange && <TodayMarker x={scale(today)} plotWidth={plotWidth} rowsHeight={rows.length * rowPitch} />}
      </View>
      <TimelineAxis range={range} scale={scale} plotWidth={plotWidth} onPlotLayout={setPlotWidth} />
      <View style={{ opacity: measured ? 1 : 0 }}>
        {rows.map((row, index) => (
          <TimelineRow key={row.id} row={row} scale={scale} index={index} ready={measured && visible} replayKey={shape} />
        ))}
      </View>
      {todayInRange && <View style={{ height: todayRowHeight }} />}
    </View>
  )
}
