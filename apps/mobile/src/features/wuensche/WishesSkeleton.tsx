import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import { ListGroup } from '@/ui/ListGroup'
import { Skeleton } from '@/ui/Skeleton'
import { SummaryFooter } from './SummaryFooter'
import { summaryDividerInset, summaryLeadingOffset, summaryLeadingSize } from './SummaryRow'

const placeholderRows = [0, 1, 2, 3]

export const WishesSkeleton = () => (
  <View accessibilityLabel="Wünsche werden geladen" accessibilityLiveRegion="polite" style={{ gap: spacing.xl }}>
    <ListGroup dividerInset={summaryDividerInset}>
      {placeholderRows.map((row) => (
        <View
          key={row}
          style={{
            minHeight: 68,
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: spacing.md,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
          }}
        >
          <Skeleton
            width={summaryLeadingSize}
            height={summaryLeadingSize}
            borderRadius={summaryLeadingSize / 2}
            style={{ marginTop: summaryLeadingOffset }}
          />
          <View style={{ flex: 1, gap: spacing.sm }}>
            <Skeleton width={72} height={13} />
            <Skeleton width={160} height={18} />
          </View>
        </View>
      ))}
    </ListGroup>
    <SummaryFooter disabled />
  </View>
)
