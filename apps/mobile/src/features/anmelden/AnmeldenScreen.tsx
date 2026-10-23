import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import { useIdentity } from '@/data/IdentityProvider'
import { ProjectContent } from '@/data/ProjectContent'
import { useProject } from '@/data/ProjectProvider'
import { haptics } from '@/lib/haptics'
import type { Identity } from '@/lib/identity'
import { Screen } from '@/ui/Screen'
import { Text } from '@/ui/Text'
import { BrandHeader } from './BrandHeader'
import { HouseholdRows } from './HouseholdRows'
import { HouseholdSkeleton } from './HouseholdSkeleton'
import { VerwaltungRow } from './VerwaltungRow'

export const AnmeldenScreen = () => {
  const project = useProject()
  const { signIn } = useIdentity()

  const choose = (identity: Identity) => {
    haptics.selection()
    signIn(identity)
  }

  return (
    <Screen contentStyle={{ paddingTop: spacing.xxl }}>
      <BrandHeader />
      <Text variant="h2" accessibilityRole="header" style={{ marginTop: spacing.xxl }}>
        Anmelden als
      </Text>
      <Text variant="bodySm" color="inkMuted" style={{ marginTop: spacing.sm }}>
        Tippe auf deinen Haushalt. Die Auswahl wird auf diesem Gerät gemerkt und lässt sich später ändern.
      </Text>
      <View style={{ marginTop: spacing.lg }}>
        <ProjectContent skeleton={<HouseholdSkeleton />} errorTitle="Haushalte konnten nicht geladen werden">
          {(data) => (
            <HouseholdRows
              data={data}
              onSelect={(householdId) => choose({ kind: 'household', householdId })}
              onReload={project.reload}
            />
          )}
        </ProjectContent>
      </View>
      <View style={{ marginTop: spacing.xl }}>
        <VerwaltungRow onPress={() => choose({ kind: 'verwaltung' })} />
      </View>
      <Text variant="caption" color="inkMuted" style={{ marginTop: spacing.xl }}>
        Demo-Daten
      </Text>
    </Screen>
  )
}
