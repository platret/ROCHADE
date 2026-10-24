import { planUpdatedTitle, spacing, type Flat } from '@rochade/shared'
import { useEffect } from 'react'
import { Pressable, View } from 'react-native'
import Animated, { LinearTransition, useReducedMotion } from 'react-native-reanimated'
import { latestChangedAt, type AssignmentChange } from '@/data/assignmentChanges'
import { formatTimestamp } from '@/lib/time'
import { Card } from '@/ui/Card'
import { fadeOut, springIn } from '@/ui/entering'
import { Icon } from '@/ui/Icon'
import { LeadingCircle } from '@/ui/LeadingCircle'
import { Text } from '@/ui/Text'
import { ChangeLine } from './ChangeLine'
import { summariseChanges } from './changes'

export type UpdateBannerProps = {
  changes: AssignmentChange[]
  flats: Flat[]
  onDismiss: () => void
  onSettled: (settled: boolean) => void
}

const iconCircle = 32
const hitArea = 44
const closeOverflow = (hitArea - iconCircle) / 2
const maxLines = 3

export const bannerSettleMs = 380

const moreLine = (count: number) => (count === 1 ? 'und 1 weitere Änderung' : `und ${count} weitere Änderungen`)

export const UpdateBanner = ({ changes, flats, onDismiss, onSettled }: UpdateBannerProps) => {
  const reduceMotion = useReducedMotion()
  const lines = summariseChanges(changes)
  const changedAt = latestChangedAt(changes)

  useEffect(() => {
    const timer = setTimeout(() => onSettled(true), reduceMotion ? 0 : bannerSettleMs)
    return () => {
      clearTimeout(timer)
      onSettled(false)
    }
  }, [onSettled, reduceMotion])

  if (lines.length === 0 || !changedAt) return null
  const shown = lines.slice(0, maxLines)
  const hidden = lines.length - shown.length
  return (
    <Animated.View entering={springIn()} exiting={fadeOut(200)} layout={LinearTransition.duration(250)}>
      <Card tone="sunken" accessibilityLiveRegion="polite" style={{ gap: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <LeadingCircle size={iconCircle} color="orangeSoft">
            <Icon name="arrow.triangle.2.circlepath" size={16} color="orangeStrong" weight="semibold" />
          </LeadingCircle>
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
          {shown.map((line) => (
            <ChangeLine key={line.field} change={line} flats={flats} />
          ))}
          {hidden > 0 && (
            <Text variant="bodySm" color="inkMuted">
              {moreLine(hidden)}
            </Text>
          )}
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
