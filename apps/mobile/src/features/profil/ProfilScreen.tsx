import { spacing } from '@rochade/shared'
import { router, Stack } from 'expo-router'
import { useIdentity } from '@/data/IdentityProvider'
import { ProjectContent } from '@/data/ProjectContent'
import { isVerwaltung } from '@/features/navigation/umzugTab'
import { useTheme } from '@/theme/useTheme'
import { Button } from '@/ui/Button'
import { Screen } from '@/ui/Screen'
import { HaushaltProfil } from './HaushaltProfil'
import { ProfilSkeleton } from './ProfilSkeleton'
import { VerwaltungProfil } from './VerwaltungProfil'

export const ProfilScreen = () => {
  const { colors } = useTheme()
  const { identity, signOut } = useIdentity()
  const verwaltung = isVerwaltung(identity)
  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button accessibilityLabel="Schliessen" tintColor={colors.ink} onPress={() => router.back()}>
          Schliessen
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <Screen contentStyle={{ paddingTop: spacing.xl, gap: spacing.xl }}>
        <ProjectContent
          skeleton={<ProfilSkeleton rows={verwaltung ? 3 : 5} />}
          errorTitle={verwaltung ? 'Die Angaben konnten nicht geladen werden' : 'Dein Haushalt konnte nicht geladen werden'}
        >
          {(data) => (verwaltung ? <VerwaltungProfil data={data} /> : <HaushaltProfil data={data} />)}
        </ProjectContent>
        <Button variant="secondary" label="Abmelden" icon="rectangle.portrait.and.arrow.right" onPress={signOut} />
      </Screen>
    </>
  )
}
