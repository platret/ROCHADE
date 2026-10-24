import type { ProjectData } from '@rochade/shared'
import { useIdentity } from '@/data/IdentityProvider'
import { useMyHousehold } from '@/data/selectors'
import { EmptyState } from '@/ui/EmptyState'
import { HouseholdPlan } from './HouseholdPlan'
import { VerwaltungNotice } from './VerwaltungNotice'

export type UmzugBodyProps = { data: ProjectData }

export const UmzugBody = ({ data }: UmzugBodyProps) => {
  const { identity, signOut } = useIdentity()
  const mine = useMyHousehold()
  if (identity?.kind === 'verwaltung') return <VerwaltungNotice data={data} onSwitch={signOut} />
  if (!mine) {
    return (
      <EmptyState
        symbol="person.crop.circle.badge.questionmark"
        title="Haushalt nicht gefunden"
        body="Der gespeicherte Haushalt ist nicht mehr im Projekt. Wähle deinen Haushalt neu aus."
        action={{ label: 'Haushalt wechseln', onPress: signOut, variant: 'secondary' }}
      />
    )
  }
  return <HouseholdPlan mine={mine} flats={data.flats} />
}
