import { gutter, radius, spacing } from '@rochade/shared'
import { View } from 'react-native'
import { ListGroup } from '@/ui/ListGroup'
import { Skeleton } from '@/ui/Skeleton'

const rows = [0, 1, 2]
const heroHeight = 48 + 2 * spacing.lg

export const WohnungSkeleton = () => (
  <View accessibilityLabel="Rochade-Wohnung wird geladen" accessibilityLiveRegion="polite" style={{ gap: spacing.xl }}>
    <View style={{ gap: spacing.sm }}>
      <Skeleton height={heroHeight} borderRadius={radius.md} />
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <Skeleton width={88} height={24} />
        <Skeleton width={120} height={24} />
      </View>
    </View>
    <ListGroup dividerInset={gutter}>
      {rows.map((row) => (
        <View
          key={row}
          style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, paddingHorizontal: spacing.lg }}
        >
          <Skeleton width={20} height={20} borderRadius={10} />
          <Skeleton width={64} height={13} />
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Skeleton width={112} height={20} />
          </View>
        </View>
      ))}
    </ListGroup>
    <View style={{ gap: spacing.md }}>
      <Skeleton height={52} borderRadius={radius.md} />
      <Skeleton height={52} borderRadius={radius.md} />
    </View>
  </View>
)
