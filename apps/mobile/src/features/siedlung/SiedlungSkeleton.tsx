import { radius, spacing } from '@rochade/shared'
import { View } from 'react-native'
import { Skeleton } from '@/ui/Skeleton'
import { timelineLayout } from './timelineLayout'

const cards = [0, 1, 2]
const rows = [0, 1, 2, 3, 4, 5]

const { labelWidth, columnGap, rowPitch, barHeight } = timelineLayout

export const SiedlungSkeleton = () => (
  <View accessibilityLabel="Zeitplan wird geladen" accessibilityLiveRegion="polite" style={{ gap: spacing.md }}>
    <Skeleton height={16} width={168} />
    <Skeleton height={24} width={120} style={{ marginTop: spacing.md }} />
    {cards.map((card) => (
      <Skeleton key={card} height={120} borderRadius={radius.md} />
    ))}
    <Skeleton height={24} width={160} style={{ marginTop: spacing.xl }} />
    <View style={{ gap: rowPitch - barHeight }}>
      {rows.map((row) => (
        <View key={row} style={{ flexDirection: 'row', alignItems: 'center', gap: columnGap }}>
          <Skeleton height={13} width={labelWidth} />
          <Skeleton height={barHeight} width="auto" style={{ flex: 1 }} />
        </View>
      ))}
    </View>
  </View>
)
