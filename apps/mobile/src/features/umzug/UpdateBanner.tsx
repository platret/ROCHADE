import { planUpdatedTitle, spacing, typeScale, type Flat } from '@rochade/shared'
import { Pressable, View } from 'react-native'
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated'
import { latestChangedAt, type AssignmentChange } from '@/data/assignmentChanges'
import { formatTimestamp } from '@/lib/time'
import { Card } from '@/ui/Card'
import { Icon } from '@/ui/Icon'
import { Text } from '@/ui/Text'
import { ChangeLine } from './ChangeLine'
import { summariseChanges } from './changes'

export type UpdateBannerProps = { changes: AssignmentChange[]; flats: Flat[]; onDismiss: () => void }

const hitArea = 44
const closeOverflow = (hitArea - typeScale.h3.lineHeight) / 2

export const UpdateBanner = ({ changes, flats, onDismiss }: UpdateBannerProps) => {
  const lines = summariseChanges(changes)
  const changedAt = latestChangedAt(changes)
  if (lines.length === 0 || !changedAt) return null
  return (
    <Animated.View entering={FadeInDown.duration(250)} exiting={FadeOut.duration(200)} layout={LinearTransition.duration(250)}>
      <Card tone="sunken" accessibilityLiveRegion="polite" style={{ gap: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Icon name="arrow.triangle.2.circlepath" size={20} color="orangeStrong" weight="semibold" />
          <Text variant="h3" accessibilityRole="header" style={{ flex: 1 }}>
            {planUpdatedTitle}
          </Text>
          <Pressable
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Hinweis schliessen"
            style={({ pressed }) => ({
              width: hitArea,
              height: hitArea,
              marginVertical: -closeOverflow,
              marginRight: -spacing.md,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Icon name="xmark" size={16} color="inkMuted" weight="semibold" />
          </Pressable>
        </View>
        <View style={{ gap: spacing.sm }}>
          {lines.map((line) => (
            <ChangeLine key={line.field} change={line} flats={flats} />
          ))}
        </View>
        <Text variant="bodySm" color="inkMuted">
          {'Geändert durch die Verwaltung am '}
          <Text variant="monoSm" color="inkMuted">
            {formatTimestamp(changedAt)}
          </Text>
        </Text>
      </Card>
    </Animated.View>
  )
}
