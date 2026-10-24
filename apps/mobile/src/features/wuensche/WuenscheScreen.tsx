import { spacing } from '@rochade/shared'
import { useIdentity } from '@/data/IdentityProvider'
import { ProjectContent } from '@/data/ProjectContent'
import { useProject } from '@/data/ProjectProvider'
import { Screen } from '@/ui/Screen'
import { Text } from '@/ui/Text'
import { StaleNotice } from './StaleNotice'
import { WishesContent } from './WishesContent'
import { WishesSkeleton } from './WishesSkeleton'

export const WuenscheScreen = () => {
  const project = useProject()
  const { identity } = useIdentity()
  return (
    <Screen refreshing={project.refreshing} onRefresh={project.reload} contentStyle={{ gap: spacing.xl }}>
      {identity?.kind === 'household' && (
        <Text color="inkMuted">So finden wir eine passende Rochade-Wohnung für deinen Haushalt.</Text>
      )}
      {project.status === 'ready' && project.error !== null && <StaleNotice updatedAt={project.updatedAt} />}
      <ProjectContent skeleton={<WishesSkeleton />} errorTitle="Wünsche konnten nicht geladen werden">
        {() => <WishesContent />}
      </ProjectContent>
    </Screen>
  )
}
