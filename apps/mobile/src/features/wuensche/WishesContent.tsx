import { useIdentity } from '@/data/IdentityProvider'
import { useMyHousehold } from '@/data/selectors'
import { EmptyState } from '@/ui/EmptyState'
import { WishesSummary } from './WishesSummary'

export const WishesContent = () => {
  const { identity, signOut } = useIdentity()
  const mine = useMyHousehold()
  if (identity?.kind === 'verwaltung') {
    return (
      <EmptyState
        symbol="building.2"
        title="Nur Ansicht"
        body="Wünsche erfassen die Haushalte selbst in ihrer App. Die Verwaltung sieht sie in der Planung."
      />
    )
  }
  if (!mine) {
    return (
      <EmptyState
        symbol="person.crop.circle.badge.questionmark"
        title="Haushalt nicht gefunden"
        body="Dieser Haushalt ist nicht mehr im Projekt. Wähle einen anderen Haushalt."
        action={{ label: 'Haushalt wechseln', onPress: signOut, variant: 'secondary' }}
      />
    )
  }
  return <WishesSummary household={mine.household} />
}
