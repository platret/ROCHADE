import { spacing } from '@rochade/shared'
import { Stack } from 'expo-router'
import { useIdentity } from '@/data/IdentityProvider'
import { ProjectContent } from '@/data/ProjectContent'
import { useProject } from '@/data/ProjectProvider'
import { Screen } from '@/ui/Screen'
import { MetaLine } from './MetaLine'
import { OfflineStrip } from './OfflineStrip'
import { UmzugBody } from './UmzugBody'
import { UmzugSkeleton } from './UmzugSkeleton'

export const UmzugScreen = () => {
  const project = useProject()
  const { signOut } = useIdentity()
  const ready = project.status === 'ready' ? project : null
  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="person.crop.circle" accessibilityLabel="Haushalt wechseln" onPress={signOut} />
      </Stack.Toolbar>
      <Screen refreshing={project.refreshing} onRefresh={project.reload} contentStyle={{ gap: spacing.lg }}>
        <ProjectContent skeleton={<UmzugSkeleton />} errorTitle="Dein Plan konnte nicht geladen werden">
          {(data) => (
            <>
              {ready !== null && <MetaLine updatedAt={ready.updatedAt} />}
              {ready !== null && ready.error !== null && <OfflineStrip updatedAt={ready.updatedAt} retry={project.reload} />}
              <UmzugBody data={data} />
            </>
          )}
        </ProjectContent>
      </Screen>
    </>
  )
}
