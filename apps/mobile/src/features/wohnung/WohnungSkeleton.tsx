import { gutter, radius, spacing } from '@rochade/shared'
import { View } from 'react-native'
import { ListGroup } from '@/ui/ListGroup'
import { Skeleton } from '@/ui/Skeleton'

const rows = [0, 1, 2]

export const WohnungSkeleton = () => (
  <View accessibilityLabel="Rochade-Wohnung wird geladen" accessibilityLiveRegion="polite" style={{ gap: spacing.xl }}>
    <View style={{ gap: spacing.sm }}>
      <Skeleton width={168} height={30} />
      <Skeleton width={120} height={16} />
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <Skeleton width={88} height={24} />
        <Skeleton width={120} height={24} />
      </View>
    </View>
    <ListGroup dividerInset={gutter}>
      {rows.map((row) => (
        <View key={row} style={{ minHeight: 64, justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.md, paddingHorizontal: spacing.lg }}>
          <Skeleton width={64} height={13} />
          <Skeleton width={128} height={20} />
        </View>
      ))}
    </ListGroup>
    <View style={{ gap: spacing.md }}>
      <Skeleton height={52} borderRadius={radius.md} />
      <Skeleton height={52} borderRadius={radius.md} />
    </View>
  </View>
)
