import { Icon } from '@/ui/Icon'
import { LeadingCircle } from '@/ui/LeadingCircle'
import { ListGroup } from '@/ui/ListGroup'
import { ListRow } from '@/ui/ListRow'

export type VerwaltungRowProps = { onPress: () => void }

export const VerwaltungRow = ({ onPress }: VerwaltungRowProps) => (
  <ListGroup>
    <ListRow
      title="Verwaltung"
      subtitle="Nur Ansicht"
      accessibilityLabel="Verwaltung (nur Ansicht)"
      leading={
        <LeadingCircle>
          <Icon name="building.2" size={20} color="inkMuted" />
        </LeadingCircle>
      }
      onPress={onPress}
    />
  </ListGroup>
)
