import { spacing } from '@rochade/shared'
import { router, Stack } from 'expo-router'
import { ProjectContent } from '@/data/ProjectContent'
import { useTheme } from '@/theme/useTheme'
import { Screen } from '@/ui/Screen'
import { WohnungBody } from './WohnungBody'
import { WohnungSkeleton } from './WohnungSkeleton'

export const WohnungSheet = () => {
  const { colors } = useTheme()
  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button accessibilityLabel="Schliessen" tintColor={colors.ink} onPress={() => router.back()}>
          Schliessen
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <Screen contentStyle={{ paddingTop: spacing.xl, gap: spacing.xl }}>
        <ProjectContent skeleton={<WohnungSkeleton />} errorTitle="Die Rochade-Wohnung konnte nicht geladen werden">
          {() => <WohnungBody />}
        </ProjectContent>
      </Screen>
    </>
  )
}
