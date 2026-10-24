import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import { Card } from '@/ui/Card'
import { listLeadingSize } from '@/ui/ListGroup'
import { Skeleton } from '@/ui/Skeleton'
import { stepCount } from './steps'
import { RailRow, railNodeSize } from './RailRow'

const steps = Array.from({ length: stepCount }, (_, index) => index)

export const UmzugSkeleton = () => (
  <View accessibilityLabel="Umzugsplan wird geladen" accessibilityLiveRegion="polite" style={{ gap: spacing.lg }}>
    <Skeleton width={160} height={14} />
    <Card style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
      <Skeleton width={listLeadingSize} height={listLeadingSize} borderRadius={listLeadingSize / 2} />
      <View style={{ flex: 1, gap: spacing.sm }}>
        <Skeleton width="40%" height={24} />
        <Skeleton width="90%" height={16} />
      </View>
    </Card>
    <Card style={{ padding: 0 }}>
      {steps.map((index) => (
        <RailRow
          key={index}
          node={<Skeleton width={railNodeSize} height={railNodeSize} borderRadius={railNodeSize / 2} />}
          first={index === 0}
          last={index === stepCount - 1}
        >
          <Skeleton width={96} height={16} />
          <Skeleton width={168} height={24} />
          <Skeleton width={120} height={14} />
        </RailRow>
      ))}
    </Card>
  </View>
)
