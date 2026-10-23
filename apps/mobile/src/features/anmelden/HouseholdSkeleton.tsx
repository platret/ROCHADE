import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import { ListGroup, listLeadingSize } from '@/ui/ListGroup'
import { Skeleton } from '@/ui/Skeleton'

const placeholderRows = [0, 1, 2, 3, 4, 5]

export const HouseholdSkeleton = () => (
  <View accessibilityLabel="Haushalte werden geladen" accessibilityLiveRegion="polite">
    <ListGroup>
      {placeholderRows.map((row) => (
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
          <Skeleton width={listLeadingSize} height={listLeadingSize} borderRadius={listLeadingSize / 2} />
          <View style={{ flex: 1, gap: spacing.sm }}>
            <Skeleton width="55%" height={16} />
            <Skeleton width="35%" height={14} />
          </View>
        </View>
      ))}
    </ListGroup>
  </View>
)
