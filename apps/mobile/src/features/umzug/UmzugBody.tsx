import type { ProjectData } from '@rochade/shared'
import { useIdentity } from '@/data/IdentityProvider'
import { useMyHousehold } from '@/data/selectors'
import { VerwaltungOverview } from '@/features/verwaltung/VerwaltungOverview'
import { EmptyState } from '@/ui/EmptyState'
import { HouseholdPlan } from './HouseholdPlan'

export type UmzugBodyProps = { data: ProjectData }

export const UmzugBody = ({ data }: UmzugBodyProps) => {
  const { identity, signOut } = useIdentity()
  const mine = useMyHousehold()
  if (identity?.kind === 'verwaltung') return <VerwaltungOverview data={data} onSwitch={signOut} />
  if (!mine) {
    return (
      <EmptyState
        symbol="person.crop.circle.badge.questionmark"
        title="Haushalt nicht gefunden"
        body="Der gespeicherte Haushalt ist nicht mehr im Projekt. Melde dich mit deinem Code neu an."
        action={{ label: 'Abmelden', onPress: signOut, variant: 'secondary' }}
      />
    )
  }
  return <HouseholdPlan mine={mine} flats={data.flats} />
}
