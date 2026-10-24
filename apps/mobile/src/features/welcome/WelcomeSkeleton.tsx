import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import { ListGroup } from '@/ui/ListGroup'
import { Skeleton } from '@/ui/Skeleton'
import { factCircleSize, factDividerInset, factRowStyle } from './FactCard'

const rows = [0, 1, 2, 3]

const Circle = () => <Skeleton width={factCircleSize} height={factCircleSize} borderRadius={factCircleSize / 2} />

export const WelcomeSkeleton = () => (
  <View accessibilityLabel="Angaben werden geladen" accessibilityLiveRegion="polite">
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
      <Circle />
      <Skeleton width={128} height={16} />
    </View>
    <Skeleton width="80%" height={32} style={{ marginTop: spacing.lg }} />
    <Skeleton width="65%" height={16} style={{ marginTop: spacing.md }} />
    <ListGroup dividerInset={factDividerInset} style={{ marginTop: spacing.xl }}>
      {rows.map((row) => (
        <View key={row} style={factRowStyle}>
          <Circle />
          <View style={{ flex: 1, gap: spacing.sm }}>
            <Skeleton width={72} height={12} />
            <Skeleton width="60%" height={16} />
          </View>
        </View>
      ))}
    </ListGroup>
  </View>
)
