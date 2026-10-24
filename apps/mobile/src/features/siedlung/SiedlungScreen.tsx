import { spacing, todayIso } from '@rochade/shared'
import { useIdentity } from '@/data/IdentityProvider'
import { ProjectContent } from '@/data/ProjectContent'
import { ProjectFreshness } from '@/data/ProjectFreshness'
import { useProject } from '@/data/ProjectProvider'
import { EmptyState } from '@/ui/EmptyState'
import { Screen } from '@/ui/Screen'
import { EtappeHighlight } from './EtappeHighlight'
import { PhasesSection } from './PhasesSection'
import { SiedlungSkeleton } from './SiedlungSkeleton'
import { UmzugsplanSection } from './UmzugsplanSection'

const NoSchedule = () => (
  <EmptyState
    symbol="calendar.badge.clock"
    title="Noch kein Zeitplan"
    body="Die Verwaltung hat die Bauetappen noch nicht veröffentlicht. Sobald der Zeitplan steht, erscheint er hier."
  />
)

export const SiedlungScreen = () => {
  const project = useProject()
  const { identity } = useIdentity()
  const ownHouseholdId = identity?.kind === 'household' ? identity.householdId : null
  const today = todayIso()
  const live = project.status === 'ready' && !project.stale
  return (
    <Screen refreshing={project.refreshing} onRefresh={project.reload} contentStyle={{ gap: spacing.xl }}>
      <ProjectContent skeleton={<SiedlungSkeleton />} errorTitle="Zeitplan konnte nicht geladen werden">
        {(data) => (
          <>
            <ProjectFreshness />
            {data.phases.length === 0 ? (
              <NoSchedule />
            ) : (
              <>
                <EtappeHighlight phases={data.phases} today={today} />
                <PhasesSection data={data} today={today} live={live} />
                <UmzugsplanSection data={data} ownHouseholdId={ownHouseholdId} today={today} />
              </>
            )}
          </>
        )}
      </ProjectContent>
    </Screen>
  )
}
