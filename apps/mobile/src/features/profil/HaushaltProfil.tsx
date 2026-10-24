import { spacing, type ProjectData } from '@rochade/shared'
import { View } from 'react-native'
import { useMyHousehold } from '@/data/selectors'
import { noHomeFlat } from '@/features/verwaltung/rowText'
import { householdInitials } from '@/lib/initials'
import { EmptyState } from '@/ui/EmptyState'
import { ListGroup } from '@/ui/ListGroup'
import { CodeRow } from './CodeRow'
import { flatFact, membersFact, pending, phaseFact, placeOf } from './facts'
import { ProfilFooter } from './ProfilFooter'
import { Initials, ProfilHeader } from './ProfilHeader'
import { profilDividerInset, ProfilRow } from './ProfilRow'

export type HaushaltProfilProps = { data: ProjectData }

export const HaushaltProfil = ({ data }: HaushaltProfilProps) => {
  const mine = useMyHousehold()
  if (!mine) {
    return (
      <EmptyState
        symbol="person.crop.circle.badge.questionmark"
        title="Haushalt nicht gefunden"
        body="Der gespeicherte Haushalt ist nicht mehr im Projekt. Melde dich ab und mit deinem Zugangscode neu an."
      />
    )
  }
  const { household, homeFlat, tempFlat, phase } = mine
  return (
    <>
      <ProfilHeader title={household.name} subtitle={placeOf(data.project)}>
        <Initials text={householdInitials(data.households)(household.id)} />
      </ProfilHeader>
      <View style={{ gap: spacing.sm }}>
        <ListGroup dividerInset={profilDividerInset}>
          <ProfilRow symbol="person.2" label="Haushalt" {...membersFact(household.members)} />
          <ProfilRow symbol="house" label="Wohnung" {...flatFact(homeFlat, noHomeFlat, true)} />
          <ProfilRow symbol="key" label="Rochade-Wohnung" tint={tempFlat ? 'slate' : 'inkMuted'} {...flatFact(tempFlat, pending)} />
          <ProfilRow symbol="calendar" label="Deine Etappe" {...phaseFact(phase)} />
          <CodeRow code={household.invite_code} />
        </ListGroup>
        <ProfilFooter hint="Bei Fragen hilft dir deine Verwaltung weiter." />
      </View>
    </>
  )
}
