import { spacing, type ProjectData } from '@rochade/shared'
import { View } from 'react-native'
import { householdCountLabel } from '@/lib/phases'
import { Icon } from '@/ui/Icon'
import { ListGroup } from '@/ui/ListGroup'
import { placeOf, textFact } from './facts'
import { ProfilFooter } from './ProfilFooter'
import { ProfilHeader } from './ProfilHeader'
import { profilDividerInset, ProfilRow } from './ProfilRow'

export type VerwaltungProfilProps = { data: ProjectData }

export const VerwaltungProfil = ({ data }: VerwaltungProfilProps) => (
  <>
    <ProfilHeader title="Verwaltung" subtitle="Den Umzugsplan bearbeitest du im Web.">
      <Icon name="building.2" size={24} color="orangeStrong" />
    </ProfilHeader>
    <View style={{ gap: spacing.sm }}>
      <ListGroup dividerInset={profilDividerInset}>
        <ProfilRow symbol="eye" label="Rolle" {...textFact('Nur Ansicht')} />
        <ProfilRow symbol="mappin.and.ellipse" label="Siedlung" {...textFact(placeOf(data.project))} />
        <ProfilRow symbol="person.3" label="Haushalte" {...textFact(householdCountLabel(data.households.length))} />
      </ListGroup>
      <ProfilFooter />
    </View>
  </>
)
