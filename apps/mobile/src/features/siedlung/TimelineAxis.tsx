import { formatMonthShort, spacing } from '@rochade/shared'
import { useWindowDimensions, View, type LayoutChangeEvent } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { Text } from '@/ui/Text'
import { timelineLayout } from './timelineLayout'
import type { Scale, TimelineRange } from './timelineModel'

export type TimelineAxisProps = {
  range: TimelineRange
  scale: Scale
  plotWidth: number
  onPlotLayout: (width: number) => void
}

const { labelWidth, columnGap, axisHeight, minLabelColumn } = timelineLayout

export const TimelineAxis = ({ range, scale, plotWidth, onPlotLayout }: TimelineAxisProps) => {
  const { colors } = useTheme()
  const { fontScale } = useWindowDimensions()
  const columnWidth = plotWidth / range.months.length / fontScale
  const labelEvery = plotWidth > 0 && columnWidth < minLabelColumn ? 2 : 1
  const measure = (event: LayoutChangeEvent) => onPlotLayout(event.nativeEvent.layout.width)
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ flexDirection: 'row', gap: columnGap, height: axisHeight + spacing.xs }}
    >
      <View style={{ width: labelWidth }} />
      <View onLayout={measure} style={{ flex: 1, height: axisHeight, borderBottomWidth: 1, borderBottomColor: colors.line }}>
        {range.months.map((month, index) => {
          if (index % labelEvery !== 0) return null
          const left = scale(month)
          const width = scale(range.months[index + 1] ?? range.end) - left
          return (
            <Text
              key={month}
              variant="label"
              color="inkMuted"
              align="center"
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
              style={{ position: 'absolute', left, width, top: spacing.xs }}
            >
              {formatMonthShort(month)}
            </Text>
          )
        })}
      </View>
    </View>
  )
}
