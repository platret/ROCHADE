import { spacing } from '@rochade/shared'
import { useState } from 'react'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useIdentity } from '@/data/IdentityProvider'
import { ProjectContent } from '@/data/ProjectContent'
import { useProject } from '@/data/ProjectProvider'
import { haptics } from '@/lib/haptics'
import type { Identity } from '@/lib/identity'
import { riseIn, staggered } from '@/ui/entering'
import { Text } from '@/ui/Text'
import { useEntered } from '@/ui/useEntered'
import { BrandHeader } from './BrandHeader'
import { DemoHeader } from './DemoHeader'
import { HouseholdRows } from './HouseholdRows'
import { HouseholdSkeleton } from './HouseholdSkeleton'
import { VerwaltungRow } from './VerwaltungRow'

const delays = { heading: 220, helper: 260, rows: 300 } as const
const verwaltungDelay = staggered(9, delays.rows)

export const AnmeldenBody = () => {
  const project = useProject()
  const { signIn } = useIdentity()
  const entered = useEntered()
  const [opening] = useState(() => project.status === 'ready')

  const choose = (identity: Identity) => {
    haptics.selection()
    signIn(identity)
  }

  if (!entered) return null
  return (
    <>
      <DemoHeader />
      <BrandHeader />
      <Animated.View entering={riseIn(delays.heading)}>
        <Text variant="h2" accessibilityRole="header" style={{ marginTop: spacing.xxl }}>
          Anmelden als
        </Text>
      </Animated.View>
      <Animated.View entering={riseIn(delays.helper)}>
        <Text variant="bodySm" color="inkMuted" style={{ marginTop: spacing.sm }}>
          Für die Demo ohne Brief: Tippe auf einen Haushalt. Die Auswahl wird auf diesem Gerät gemerkt und lässt sich
          über «Abmelden» ändern.
        </Text>
      </Animated.View>
      <View style={{ marginTop: spacing.lg }}>
        <ProjectContent skeleton={<HouseholdSkeleton />} errorTitle="Haushalte konnten nicht geladen werden">
          {(data) => (
            <HouseholdRows
              data={data}
              delay={opening ? delays.rows : 0}
              onSelect={(householdId) => choose({ kind: 'household', householdId })}
              onReload={project.reload}
            />
          )}
        </ProjectContent>
      </View>
      <View style={{ marginTop: spacing.xl }}>
        <VerwaltungRow delay={verwaltungDelay} onPress={() => choose({ kind: 'verwaltung' })} />
      </View>
      <Animated.View entering={riseIn(verwaltungDelay + staggered(1))}>
        <Text variant="caption" color="inkMuted" style={{ marginTop: spacing.xl }}>
          Demo-Daten
        </Text>
      </Animated.View>
    </>
  )
}
