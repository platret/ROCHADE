import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import { ListGroup } from '@/ui/ListGroup'
import { Skeleton } from '@/ui/Skeleton'
import { avatarSize } from './ProfilHeader'
import { profilDividerInset } from './ProfilRow'

export type ProfilSkeletonProps = { rows: number }

export const ProfilSkeleton = ({ rows }: ProfilSkeletonProps) => (
  <View accessibilityLabel="Profil wird geladen" accessibilityLiveRegion="polite" style={{ gap: spacing.xl }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
      <Skeleton width={avatarSize} height={avatarSize} borderRadius={avatarSize / 2} />
      <View style={{ flex: 1, gap: spacing.sm }}>
        <Skeleton width="60%" height={24} />
        <Skeleton width="45%" height={14} />
      </View>
    </View>
    <ListGroup dividerInset={profilDividerInset}>
      {Array.from({ length: rows }, (_, row) => (
        <View key={row} style={{ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg }}>
          <Skeleton width={20} height={20} borderRadius={10} />
          <View style={{ flex: 1, gap: spacing.sm }}>
            <Skeleton width={72} height={12} />
            <Skeleton width="55%" height={16} />
          </View>
        </View>
      ))}
    </ListGroup>
  </View>
)
