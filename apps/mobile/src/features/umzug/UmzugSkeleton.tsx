import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import { Card } from '@/ui/Card'
import { Skeleton } from '@/ui/Skeleton'
import { stepCount } from './steps'
import { RailRow, railNodeSize } from './RailRow'

const steps = Array.from({ length: stepCount }, (_, index) => index)
const iconCircle = 48

export const UmzugSkeleton = () => (
  <View accessibilityLabel="Umzugsplan wird geladen" accessibilityLiveRegion="polite" style={{ gap: spacing.lg }}>
    <Skeleton width={160} height={14} />
    <Card style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <Skeleton width={iconCircle} height={iconCircle} borderRadius={iconCircle / 2} />
        <Skeleton width="45%" height={32} />
      </View>
      <Skeleton width="90%" height={16} />
      <Skeleton height={4} />
    </Card>
    <Card style={{ padding: 0 }}>
      {steps.map((index) => (
        <RailRow
          key={index}
          index={index}
          draw={false}
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
