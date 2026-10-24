import { router } from 'expo-router'
import { useMyHousehold } from '@/data/selectors'
import { EmptyState } from '@/ui/EmptyState'
import { Screen } from '@/ui/Screen'
import { WishesForm } from './WishesForm'

export const EditWishesSheet = () => {
  const mine = useMyHousehold()
  if (!mine) {
    return (
      <Screen>
        <EmptyState
          symbol="person.crop.circle.badge.questionmark"
          title="Haushalt nicht gefunden"
          body="Die Wünsche können gerade nicht bearbeitet werden."
          action={{ label: 'Schliessen', onPress: () => router.back(), variant: 'secondary' }}
        />
      </Screen>
    )
  }
  return <WishesForm household={mine.household} />
}
