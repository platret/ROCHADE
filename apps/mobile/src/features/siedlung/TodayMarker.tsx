import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import Svg, { Line } from 'react-native-svg'
import { useTheme } from '@/theme/useTheme'
import { Text } from '@/ui/Text'
import { Dot } from './Dot'
import { timelineLayout } from './timelineLayout'

export type TodayMarkerProps = { x: number; plotWidth: number; rowsHeight: number }

const { todayLabelWidth } = timelineLayout
const dotSize = 6
const lineWidth = 1

export const TodayMarker = ({ x, plotWidth, rowsHeight }: TodayMarkerProps) => {
  const { colors } = useTheme()
  const labelLeft = Math.min(Math.max(x - todayLabelWidth / 2, 0), Math.max(plotWidth - todayLabelWidth, 0))
  return (
    <>
      <View style={{ position: 'absolute', top: -spacing.xs - dotSize / 2, left: x - dotSize / 2 }}>
        <Dot size={dotSize} color="lineStrong" />
      </View>
      <Svg width={lineWidth * 2} height={rowsHeight} style={{ position: 'absolute', top: 0, left: x - lineWidth }}>
        <Line x1={lineWidth} y1={0} x2={lineWidth} y2={rowsHeight} stroke={colors.lineStrong} strokeWidth={lineWidth} strokeDasharray="3 3" />
      </Svg>
      <Text
        variant="label"
        color="inkMuted"
        align="center"
        numberOfLines={1}
        maxFontSizeMultiplier={1.3}
        style={{ position: 'absolute', top: rowsHeight + spacing.xs, left: labelLeft, width: todayLabelWidth }}
      >
        Heute
      </Text>
    </>
  )
}
