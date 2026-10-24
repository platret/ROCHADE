import { addDays, radius, spacing, type Phase } from '@rochade/shared'
import { useState } from 'react'
import { View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { TimelineAxis } from './TimelineAxis'
import { timelineLayout } from './timelineLayout'
import { scaleFor, type TimelineRange } from './timelineModel'
import { TimelineRow } from './TimelineRow'
import type { TimelineRow as Row } from './timelineRows'

export type TimelineProps = { rows: Row[]; range: TimelineRange; runningPhase: Phase | null }

const { labelWidth, columnGap, axisHeight } = timelineLayout

export const Timeline = ({ rows, range, runningPhase }: TimelineProps) => {
  const { colors } = useTheme()
  const [plotWidth, setPlotWidth] = useState(0)
  const scale = scaleFor(range, plotWidth)
  const gridlines = [...range.months, range.end].map((month) => Math.min(scale(month), Math.max(plotWidth - 1, 0)))
  return (
    <View>
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
      </View>
      <TimelineAxis range={range} scale={scale} plotWidth={plotWidth} onPlotLayout={setPlotWidth} />
      <View style={{ opacity: plotWidth > 0 ? 1 : 0 }}>
        {rows.map((row) => (
          <TimelineRow key={row.id} row={row} scale={scale} />
        ))}
      </View>
    </View>
  )
}
