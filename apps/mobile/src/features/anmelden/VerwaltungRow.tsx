import Animated from 'react-native-reanimated'
import { riseIn } from '@/ui/entering'
import { Icon } from '@/ui/Icon'
import { ListGroup } from '@/ui/ListGroup'
import { RingCircle } from '@/ui/RingCircle'
import { TactileRow } from '@/ui/TactileRow'

export type VerwaltungRowProps = { delay: number; onPress: () => void }

export const VerwaltungRow = ({ delay, onPress }: VerwaltungRowProps) => (
  <Animated.View entering={riseIn(delay)}>
    <ListGroup>
      <TactileRow
        title="Verwaltung"
        subtitle="Nur Ansicht"
        accessibilityLabel="Verwaltung (nur Ansicht)"
        leading={
          <RingCircle>
            <Icon name="building.2" size={20} color="inkMuted" />
          </RingCircle>
        }
        onPress={onPress}
      />
    </ListGroup>
  </Animated.View>
)
