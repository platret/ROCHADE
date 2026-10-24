import { spacing, type ProjectData } from '@rochade/shared'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { useProject } from '@/data/ProjectProvider'
import { Button } from '@/ui/Button'
import { EmptyState } from '@/ui/EmptyState'
import { latestChangeByHousehold } from './changes'
import { ChangesBanner } from './ChangesBanner'
import { HouseholdList } from './HouseholdList'
import { overviewRows, statusCounts } from './overview'
import { PhaseList } from './PhaseList'
import { SummaryCard } from './SummaryCard'
import { useBatchFeedback } from './useBatchFeedback'

export type VerwaltungOverviewProps = { data: ProjectData; onSwitch: () => void }

const NoHouseholds = () => (
  <EmptyState
    symbol="house"
    title="Noch keine Haushalte"
    body="Sobald Haushalte im Projekt erfasst sind, erscheinen hier Status, Rochade-Wohnung und Termine aller Haushalte."
  />
)

export const VerwaltungOverview = ({ data, onSwitch }: VerwaltungOverviewProps) => {
  const { changes, lastChangeAt, dismissChanges } = useProject()
  const rows = overviewRows(data)
  const flashAt = latestChangeByHousehold(changes)
  useBatchFeedback(changes, lastChangeAt)
  return (
    <>
      {changes.length > 0 && <ChangesBanner changes={changes} onDismiss={() => dismissChanges()} />}
      <Animated.View layout={LinearTransition.duration(250)} style={{ gap: spacing.xl }}>
        {rows.length === 0 ? (
          <NoHouseholds />
        ) : (
          <>
            <SummaryCard counts={statusCounts(rows)} />
            <HouseholdList rows={rows} flashAt={flashAt} />
          </>
        )}
        <PhaseList phases={data.phases} />
        <Button variant="ghost" label="Haushalt wechseln" icon="person.crop.circle" onPress={onSwitch} />
      </Animated.View>
    </>
  )
}
