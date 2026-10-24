import { radius, spacing } from '@rochade/shared'
import { View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { Text } from '@/ui/Text'
import { Dot } from './Dot'
import { Segment, Tick } from './Segment'
import { timelineLayout } from './timelineLayout'
import type { Scale } from './timelineModel'
import type { TimelineRow as Row } from './timelineRows'

export type TimelineRowProps = { row: Row; scale: Scale }

const { labelWidth, columnGap, rowPitch, barHeight, tickHeight, tickWidth, segmentGap, minSegmentWidth, bandOutset } = timelineLayout

const fill = { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 } as const

export const TimelineRow = ({ row, scale }: TimelineRowProps) => {
  const { colors } = useTheme()
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={row.summary}
      style={{ height: rowPitch, flexDirection: 'row', alignItems: 'center', gap: columnGap }}
    >
      {row.own && (
        <View style={{ ...fill, left: -bandOutset, right: -bandOutset, borderRadius: radius.sm, backgroundColor: colors.surfaceSunken }} />
      )}
      <View style={{ width: labelWidth, flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
        <Text
          variant="label"
          weight={row.own ? 700 : 600}
          color={row.own ? 'ink' : 'inkMuted'}
          numberOfLines={1}
          maxFontSizeMultiplier={1.3}
        >
          {row.initials}
        </Text>
        {row.own && <Dot size={4} color="ink" />}
        {row.conflict && <Dot size={6} color="danger" />}
      </View>
      <View style={{ flex: 1, height: barHeight }}>
        <Segment kind="home" style={fill} />
        {row.segments.map((segment, index) => {
          const left = scale(segment.start) + (index > 0 ? segmentGap : 0)
          const width = Math.max(minSegmentWidth, scale(segment.end) - left)
          return <Segment key={segment.kind} kind={segment.kind} style={{ position: 'absolute', top: 0, bottom: 0, left, width }} />
        })}
        {row.moveOut !== null && (
          <Tick
            height={tickHeight}
            style={{ position: 'absolute', top: (barHeight - tickHeight) / 2, left: scale(row.moveOut) - tickWidth / 2 }}
          />
        )}
      </View>
    </View>
  )
}
