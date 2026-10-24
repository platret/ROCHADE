import { spacing } from '@rochade/shared'
import { router } from 'expo-router'
import { View } from 'react-native'
import { useMyHousehold } from '@/data/selectors'
import { EmptyState, type StateAction } from '@/ui/EmptyState'
import { CalendarAction } from './CalendarAction'
import { calendarEntries } from './calendarEntries'
import { FactsList } from './FactsList'
import { FlatHeader } from './FlatHeader'
import { planOf, type WohnungPlan } from './plan'
import { ShareButton } from './ShareButton'

const close: StateAction = { label: 'Schliessen', onPress: () => router.back(), variant: 'secondary' }

const Detail = ({ plan }: { plan: WohnungPlan }) => (
  <>
    <FlatHeader flat={plan.tempFlat} />
    <FactsList plan={plan} />
    <View style={{ gap: spacing.md }}>
      <CalendarAction householdId={plan.householdId} entries={calendarEntries(plan)} />
      <ShareButton plan={plan} />
    </View>
  </>
)

export const WohnungBody = () => {
  const mine = useMyHousehold()
  if (!mine) {
    return (
      <EmptyState
        symbol="person.crop.circle.badge.questionmark"
        title="Haushalt nicht gefunden"
        body="Die Rochade-Wohnung kann gerade nicht angezeigt werden."
        action={close}
      />
    )
  }
  const plan = planOf(mine)
  if (!plan) {
    return (
      <EmptyState
        symbol="house"
        title="Noch keine Rochade-Wohnung"
        body="Sobald die Verwaltung dir eine Rochade-Wohnung zugeteilt hat, siehst du hier alle Angaben dazu."
        detail="Du musst nichts unternehmen."
        action={close}
      />
    )
  }
  return <Detail plan={plan} />
}
