import { gutter, spacing } from '@rochade/shared'
import { View } from 'react-native'
import { ListGroup } from '@/ui/ListGroup'
import { Skeleton } from '@/ui/Skeleton'
import { SummaryFooter } from './SummaryFooter'

const placeholderRows = [0, 1, 2, 3]

export const WishesSkeleton = () => (
  <View accessibilityLabel="Wünsche werden geladen" accessibilityLiveRegion="polite" style={{ gap: spacing.xl }}>
    <ListGroup dividerInset={gutter}>
      {placeholderRows.map((row) => (
        <View
          key={row}
          style={{
            minHeight: 64,
            justifyContent: 'center',
            gap: spacing.sm,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
          }}
        >
          <Skeleton width={72} height={13} />
          <Skeleton width={160} height={18} />
        </View>
      ))}
    </ListGroup>
    <SummaryFooter disabled />
  </View>
)
