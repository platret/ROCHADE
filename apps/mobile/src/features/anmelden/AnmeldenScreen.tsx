import { spacing } from '@rochade/shared'
import { useState } from 'react'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useIdentity } from '@/data/IdentityProvider'
import { ProjectContent } from '@/data/ProjectContent'
import { useProject } from '@/data/ProjectProvider'
import { haptics } from '@/lib/haptics'
import type { Identity } from '@/lib/identity'
import { useTheme } from '@/theme/useTheme'
import { riseIn, staggered } from '@/ui/entering'
import { Screen } from '@/ui/Screen'
import { Text } from '@/ui/Text'
import { BrandHeader } from './BrandHeader'
import { HouseholdRows } from './HouseholdRows'
import { HouseholdSkeleton } from './HouseholdSkeleton'
import { VerwaltungRow } from './VerwaltungRow'

const delays = { heading: 220, helper: 260, rows: 300 } as const
const verwaltungDelay = staggered(9, delays.rows)

export const AnmeldenScreen = () => {
  const project = useProject()
  const { signIn } = useIdentity()
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const [opening] = useState(() => project.status === 'ready')

  const choose = (identity: Identity) => {
    haptics.selection()
    signIn(identity)
  }

  return (
    <View style={{ flex: 1 }}>
      <Screen contentStyle={{ paddingTop: spacing.xxl }}>
        <BrandHeader />
        <Animated.View entering={riseIn(delays.heading)}>
          <Text variant="h2" accessibilityRole="header" style={{ marginTop: spacing.xxl }}>
            Anmelden als
          </Text>
        </Animated.View>
        <Animated.View entering={riseIn(delays.helper)}>
          <Text variant="bodySm" color="inkMuted" style={{ marginTop: spacing.sm }}>
            Tippe auf deinen Haushalt. Die Auswahl wird auf diesem Gerät gemerkt und lässt sich später ändern.
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
      </Screen>
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top, backgroundColor: colors.paper, zIndex: 1 }}
      />
    </View>
  )
}
