import { planUpdatedTitle, spacing, typeScale } from '@rochade/shared'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated'
import { Card } from '@/ui/Card'
import { Flash } from '@/ui/Flash'
import { Icon } from '@/ui/Icon'
import { LeadingCircle } from '@/ui/LeadingCircle'
import { Text } from '@/ui/Text'
import { useLatched } from '@/ui/useEntered'
import type { StageProps } from './stage'
import { StatusSwap } from './StatusSwap'

const bannerDelayMs = 350
const resolveDelayMs = 1500
const slideFrom = -16
const spring = { damping: 18, stiffness: 160 }
const labelOffset = (typeScale.body.lineHeight - typeScale.label.lineHeight) / 2
const label =
  'Beispiel: Dein Plan wurde aktualisiert. Auszug neu am 15.09.2027, vorher 01.09.2027. Grund: Die Etappe in Haus A startet zwei Wochen später. Status neu: Zugeteilt.'

const ChangeRow = () => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', columnGap: spacing.md }}>
    <Text variant="label" color="inkMuted" style={{ paddingTop: labelOffset }}>
      Auszug
    </Text>
    <View style={{ alignItems: 'flex-end' }}>
      <Text variant="mono">15.09.2027</Text>
      <Text variant="bodySm" color="inkMuted">
        {'vorher '}
        <Text variant="monoSm" color="inkMuted" style={{ textDecorationLine: 'line-through' }}>
          01.09.2027
        </Text>
      </Text>
    </View>
  </View>
)

export const LiveStage = ({ active }: StageProps) => {
  const play = useLatched(active)
  const reduceMotion = useReducedMotion()
  const progress = useSharedValue(0)
  const [flashKey, setFlashKey] = useState<number | null>(null)
  const [resolved, setResolved] = useState(false)

  useEffect(() => {
    if (!play) return
    const show = () => {
      progress.set(reduceMotion ? 1 : withSpring(1, spring))
      setFlashKey(1)
    }
    const showTimer = setTimeout(show, reduceMotion ? 0 : bannerDelayMs)
    const resolveTimer = setTimeout(() => setResolved(true), resolveDelayMs)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(resolveTimer)
    }
  }, [play, progress, reduceMotion])

  const bannerStyle = useAnimatedStyle(() => ({
    opacity: progress.get(),
    transform: [{ translateY: slideFrom * (1 - progress.get()) }],
  }))

  return (
    <View accessible accessibilityLabel={label} style={{ gap: spacing.md }}>
      <Animated.View style={bannerStyle}>
        <Card tone="sunken" style={{ padding: 0, overflow: 'hidden' }}>
          <Flash flashKey={flashKey}>
            <View style={{ padding: spacing.lg, gap: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <LeadingCircle size={32} color="orangeSoft">
                  <Icon name="arrow.triangle.2.circlepath" size={16} color="orangeStrong" weight="semibold" />
                </LeadingCircle>
                <Text variant="h3" style={{ flex: 1 }}>
                  {planUpdatedTitle}
                </Text>
              </View>
              <ChangeRow />
              <Text variant="bodySm" color="inkMuted">
                Grund: Die Etappe in Haus A startet zwei Wochen später.
              </Text>
            </View>
          </Flash>
        </Card>
      </Animated.View>
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text weight={600}>Rochade-Wohnung</Text>
          <Text variant="bodySm" color="inkMuted">
            {'Whg. '}
            <Text variant="monoSm" color="inkMuted">
              D.01
            </Text>
            {' · Haus D'}
          </Text>
        </View>
        <StatusSwap resolved={resolved} />
      </Card>
    </View>
  )
}
