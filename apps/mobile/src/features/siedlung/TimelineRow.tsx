import { radius, spacing, type ISODate } from '@rochade/shared'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useTheme } from '@/theme/useTheme'
import { Text } from '@/ui/Text'
import { Dot } from './Dot'
import { Segment, Tick } from './Segment'
import { timelineLayout } from './timelineLayout'
import type { Scale } from './timelineModel'
import type { TimelineRow as Row } from './timelineRows'
import { useReveal } from './useReveal'

export type TimelineRowProps = { row: Row; scale: Scale; index: number; ready: boolean; replayKey: string }

const { labelWidth, columnGap, rowPitch, barHeight, tickHeight, tickWidth, segmentGap, minSegmentWidth } = timelineLayout
const tickOverhang = (tickHeight - barHeight) / 2

const fill = { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 } as const

export const TimelineRow = ({ row, scale, index, ready, replayKey }: TimelineRowProps) => {
  const { colors } = useTheme()
  const revealStyle = useReveal(ready, index, 1, replayKey)
  const tickStyle = (day: ISODate) => ({ position: 'absolute', top: 0, left: scale(day) - tickWidth / 2 }) as const
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={row.summary}
      style={{ height: rowPitch, flexDirection: 'row', alignItems: 'center', gap: columnGap }}
    >
      <View style={{ width: labelWidth, flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
        <View
          style={
            row.own && {
              backgroundColor: colors.slateSoft,
              borderRadius: radius.sm,
              paddingHorizontal: spacing.xs,
              paddingVertical: 2,
              marginLeft: -spacing.xs,
            }
          }
        >
          <Text
            variant="label"
            weight={row.own ? 700 : 600}
            color={row.own ? 'slate' : 'inkMuted'}
            numberOfLines={1}
            maxFontSizeMultiplier={1.3}
          >
            {row.initials}
          </Text>
        </View>
        {row.conflict && <Dot size={6} color="danger" />}
      </View>
      <View style={{ flex: 1, height: barHeight }}>
        <Segment kind="home" style={fill} />
        <Animated.View style={[{ position: 'absolute', left: 0, top: -tickOverhang, height: tickHeight, overflow: 'hidden' }, revealStyle]}>
          {row.segments.map((segment, index) => {
            const left = scale(segment.start) + (index > 0 ? segmentGap : 0)
            const width = Math.max(minSegmentWidth, scale(segment.end) - left)
            return (
              <Segment
                key={segment.kind}
                kind={segment.kind}
                style={{ position: 'absolute', top: tickOverhang, height: barHeight, left, width }}
              />
            )
          })}
          {row.moveOut !== null && <Tick own={row.own} height={tickHeight} style={tickStyle(row.moveOut)} />}
          {row.moveBack !== null && <Tick own={row.own} height={tickHeight} style={tickStyle(row.moveBack)} />}
        </Animated.View>
      </View>
    </View>
  )
}
