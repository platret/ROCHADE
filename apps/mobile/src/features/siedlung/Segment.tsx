import { radius } from '@rochade/shared'
import { View, type StyleProp, type ViewStyle } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { timelineLayout } from './timelineLayout'
import { segmentLooks, tickColor, type SegmentKind } from './timelineModel'

export type SegmentProps = { kind: SegmentKind; borderRadius?: number; style?: StyleProp<ViewStyle> }

export const Segment = ({ kind, borderRadius = radius.sm, style }: SegmentProps) => {
  const { colors } = useTheme()
  const look = segmentLooks[kind]
  return (
    <View
      style={[
        { borderRadius },
        look.fill !== null && { backgroundColor: colors[look.fill] },
        look.outline !== null && {
          borderWidth: timelineLayout.outlineWidth,
          borderColor: colors[look.outline],
          borderStyle: look.dashed ? 'dashed' : 'solid',
        },
        style,
      ]}
    />
  )
}

export type TickProps = { height: number; own?: boolean; style?: StyleProp<ViewStyle> }

export const Tick = ({ height, own = false, style }: TickProps) => {
  const { colors } = useTheme()
  const { tickWidth } = timelineLayout
  return <View style={[{ width: tickWidth, height, borderRadius: tickWidth / 2, backgroundColor: colors[tickColor(own)] }, style]} />
}
