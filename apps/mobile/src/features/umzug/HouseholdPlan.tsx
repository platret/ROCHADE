import { spacing, type Flat } from '@rochade/shared'
import { useState } from 'react'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { useProject } from '@/data/ProjectProvider'
import type { MyHousehold } from '@/data/selectors'
import { Checklist } from '@/features/checklist/Checklist'
import { EmptyState } from '@/ui/EmptyState'
import { useEntered, useLatched } from '@/ui/useEntered'
import { Journey } from './Journey'
import { StatusCard } from './StatusCard'
import { UpdateBanner } from './UpdateBanner'
import { useChangeFeedback } from './useChangeFeedback'

export type HouseholdPlanProps = { mine: MyHousehold; flats: Flat[] }

const NotPlanned = () => (
  <EmptyState
    symbol="clock"
    title="Noch nicht geplant"
    body="Sobald die Verwaltung deinen Umzug geplant hat, erscheinen hier Auszug, Rochade-Wohnung und Rückkehr."
    detail="Du musst nichts unternehmen."
  />
)

export const HouseholdPlan = ({ mine, flats }: HouseholdPlanProps) => {
  const { changes, lastChangeAt, dismissChanges } = useProject()
  const entered = useEntered()
  const [bannerSettled, setBannerSettled] = useState(false)
  const { household, assignment, tempFlat, homeFlat } = mine
  const myChanges = changes.filter((change) => change.householdId === household.id)
  const play = useLatched(entered && (myChanges.length === 0 || bannerSettled))
  const flashChanges = bannerSettled ? myChanges : []
  useChangeFeedback(myChanges, lastChangeAt)
  return (
    <>
      {myChanges.length > 0 && (
        <UpdateBanner changes={myChanges} flats={flats} onDismiss={() => dismissChanges(household.id)} onSettled={setBannerSettled} />
      )}
      <Animated.View layout={LinearTransition.duration(250)} style={{ gap: spacing.lg }}>
        {assignment !== null && assignment.status !== 'open' ? (
          <>
            <StatusCard assignment={assignment} householdName={household.name} />
            <Journey assignment={assignment} tempFlat={tempFlat} homeFlat={homeFlat} changes={flashChanges} play={play} />
            <Checklist householdId={household.id} assignment={assignment} />
          </>
        ) : (
          <NotPlanned />
        )}
      </Animated.View>
    </>
  )
}
