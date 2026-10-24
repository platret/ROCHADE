import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import { Card } from '@/ui/Card'
import { ListGroup } from '@/ui/ListGroup'
import { Skeleton } from '@/ui/Skeleton'

const columns = [0, 1, 2]
const rows = [0, 1, 2, 3, 4, 5]

export const VerwaltungSkeleton = () => (
  <View accessibilityLabel="Übersicht wird geladen" accessibilityLiveRegion="polite" style={{ gap: spacing.xl }}>
    <Skeleton width={160} height={14} />
    <Card style={{ flexDirection: 'row', padding: 0 }}>
      {columns.map((column) => (
        <View key={column} style={{ flex: 1, padding: spacing.lg, gap: spacing.sm }}>
          <Skeleton width="70%" height={16} />
          <Skeleton width={40} height={30} />
        </View>
      ))}
    </Card>
    <View style={{ gap: spacing.md }}>
      <Skeleton width={120} height={24} />
      <ListGroup dividerInset={spacing.lg}>
        {rows.map((row) => (
          <View
            key={row}
            style={{
              minHeight: 64,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.md,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.lg,
            }}
          >
            <View style={{ flex: 1, gap: spacing.sm }}>
              <Skeleton width="55%" height={16} />
              <Skeleton width="70%" height={14} />
            </View>
            <Skeleton width={88} height={24} />
          </View>
        ))}
      </ListGroup>
    </View>
  </View>
)
