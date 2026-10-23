import { spacing } from '@rochade/shared'
import type { ReactNode } from 'react'
import { useIdentity } from '@/data/IdentityProvider'
import { ProjectContent } from '@/data/ProjectContent'
import { useProject } from '@/data/ProjectProvider'
import { useMyHousehold } from '@/data/selectors'
import { Card } from '@/ui/Card'
import { Screen } from '@/ui/Screen'
import { Skeleton } from '@/ui/Skeleton'
import { Text } from '@/ui/Text'

export type PlaceholderScreenProps = { title: string; footer?: ReactNode }

const PlaceholderSkeleton = () => (
  <Card style={{ gap: spacing.sm }}>
    <Skeleton width="40%" height={18} />
    <Skeleton width="70%" height={16} />
  </Card>
)

export const PlaceholderScreen = ({ title, footer }: PlaceholderScreenProps) => {
  const project = useProject()
  const { identity } = useIdentity()
  const mine = useMyHousehold()
  const who = mine?.household.name ?? (identity?.kind === 'verwaltung' ? 'Verwaltung (nur Ansicht)' : 'Haushalt nicht gefunden')
  return (
    <Screen refreshing={project.refreshing} onRefresh={project.reload} contentStyle={{ gap: spacing.lg }}>
      <ProjectContent skeleton={<PlaceholderSkeleton />}>
        {() => (
          <Card style={{ gap: spacing.xs }}>
            <Text variant="h3">{title}</Text>
            <Text color="inkMuted">{who}</Text>
          </Card>
        )}
      </ProjectContent>
      {footer}
    </Screen>
  )
}
