import { spacing, type ProjectData } from '@rochade/shared'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useIdentity } from '@/data/IdentityProvider'
import { haptics } from '@/lib/haptics'
import type { Identity } from '@/lib/identity'
import { EmptyState } from '@/ui/EmptyState'
import { riseIn, staggered } from '@/ui/entering'
import { Text } from '@/ui/Text'
import { useEntered } from '@/ui/useEntered'
import { ConfirmedBadge } from './ConfirmedBadge'
import { FactCard } from './FactCard'
import { backToCode } from './route'
import { welcomeFor } from './welcome'
import { WelcomeActions } from './WelcomeActions'

export type WelcomeBodyProps = { data: ProjectData; identity: Identity | null }

const delays = { title: 80, intro: 120, facts: 180 } as const

const NotFound = () => (
  <EmptyState
    symbol="person.crop.circle.badge.questionmark"
    title="Haushalt nicht gefunden"
    body="Zu diesem Code finden wir keinen Haushalt. Prüfe die sechs Zeichen im Brief deiner Verwaltung."
    action={{ label: 'Code erneut eingeben', onPress: backToCode }}
  />
)

export const WelcomeBody = ({ data, identity }: WelcomeBodyProps) => {
  const entered = useEntered()
  const { signIn } = useIdentity()
  const welcome = identity ? welcomeFor(data, identity) : null
  if (!entered) return null
  if (!identity || !welcome) return <NotFound />
  const count = welcome.facts.length

  const confirm = () => {
    haptics.success()
    signIn(identity)
  }

  return (
    <>
      <ConfirmedBadge />
      <Animated.View entering={riseIn(delays.title)}>
        <Text variant="h1" accessibilityRole="header" style={{ marginTop: spacing.lg }}>
          {welcome.title}
        </Text>
      </Animated.View>
      {welcome.intro ? (
        <Animated.View entering={riseIn(delays.intro)}>
          <Text color="inkMuted" style={{ marginTop: spacing.sm }}>
            {welcome.intro}
          </Text>
        </Animated.View>
      ) : null}
      <View style={{ marginTop: spacing.xl }}>
        <FactCard facts={welcome.facts} delay={delays.facts} />
      </View>
      {welcome.note ? (
        <Animated.View entering={riseIn(staggered(count, delays.facts))}>
          <Text variant="bodySm" color="inkMuted" style={{ marginTop: spacing.md }}>
            {welcome.note}
          </Text>
        </Animated.View>
      ) : null}
      <WelcomeActions confirmLabel={welcome.confirmLabel} onConfirm={confirm} delay={staggered(count + 1, delays.facts)} />
    </>
  )
}
