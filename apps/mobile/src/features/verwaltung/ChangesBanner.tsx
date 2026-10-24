import { spacing } from '@rochade/shared'
import { Pressable, View } from 'react-native'
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated'
import { latestChangedAt, type AssignmentChange } from '@/data/assignmentChanges'
import { householdCountLabel } from '@/lib/phases'
import { formatTimestamp } from '@/lib/time'
import { Card } from '@/ui/Card'
import { Icon } from '@/ui/Icon'
import { Text } from '@/ui/Text'
import { affectedHouseholdIds, bannerTitle } from './changes'

export type ChangesBannerProps = { changes: AssignmentChange[]; onDismiss: () => void }

const hitArea = 44

export const ChangesBanner = ({ changes, onDismiss }: ChangesBannerProps) => {
  const changedAt = latestChangedAt(changes)
  if (!changedAt) return null
  return (
    <Animated.View entering={FadeInDown.duration(250)} exiting={FadeOut.duration(200)} layout={LinearTransition.duration(250)}>
      <Card
        tone="sunken"
        accessibilityLiveRegion="polite"
        style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md, paddingRight: spacing.sm }}
      >
        <Icon name="arrow.triangle.2.circlepath" size={20} color="orangeStrong" weight="semibold" />
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text weight={600}>{bannerTitle(changes.length)}</Text>
          <Text variant="bodySm" color="inkMuted">
            {`${householdCountLabel(affectedHouseholdIds(changes).length)} · `}
            <Text variant="monoSm" color="inkMuted">
              {formatTimestamp(changedAt)}
            </Text>
          </Text>
        </View>
        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Hinweis schliessen"
          style={({ pressed }) => ({
            width: hitArea,
            height: hitArea,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Icon name="xmark" size={16} color="inkMuted" weight="semibold" />
        </Pressable>
      </Card>
    </Animated.View>
  )
}
