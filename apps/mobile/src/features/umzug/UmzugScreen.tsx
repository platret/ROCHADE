import { spacing } from '@rochade/shared'
import { Stack } from 'expo-router'
import { useIdentity } from '@/data/IdentityProvider'
import { ProjectContent } from '@/data/ProjectContent'
import { ProjectFreshness } from '@/data/ProjectFreshness'
import { useProject } from '@/data/ProjectProvider'
import { VerwaltungSkeleton } from '@/features/verwaltung/VerwaltungSkeleton'
import { Screen } from '@/ui/Screen'
import { UmzugBody } from './UmzugBody'
import { UmzugSkeleton } from './UmzugSkeleton'

export const UmzugScreen = () => {
  const project = useProject()
  const { identity, signOut } = useIdentity()
  const verwaltung = identity?.kind === 'verwaltung'
  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="person.crop.circle" accessibilityLabel="Haushalt wechseln" onPress={signOut} />
      </Stack.Toolbar>
      <Screen refreshing={project.refreshing} onRefresh={project.reload} contentStyle={{ gap: spacing.lg }}>
        <ProjectContent
          skeleton={verwaltung ? <VerwaltungSkeleton /> : <UmzugSkeleton />}
          errorTitle={verwaltung ? 'Die Übersicht konnte nicht geladen werden' : 'Dein Plan konnte nicht geladen werden'}
        >
          {(data) => (
            <>
              <ProjectFreshness />
              <UmzugBody data={data} />
            </>
          )}
        </ProjectContent>
      </Screen>
    </>
  )
}
