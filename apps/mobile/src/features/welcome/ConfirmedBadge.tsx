import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'
import { fadeIn } from '@/ui/entering'
import { Icon } from '@/ui/Icon'
import { LeadingCircle } from '@/ui/LeadingCircle'
import { PopIn } from '@/ui/PopIn'
import { Text } from '@/ui/Text'
import { factCircleSize } from './FactCard'

export const ConfirmedBadge = () => (
  <View
    accessible
    accessibilityRole="text"
    accessibilityLabel="Code bestätigt"
    style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}
  >
    <PopIn from={0.4}>
      <LeadingCircle size={factCircleSize} color="successSoft">
        <Icon name="checkmark" size={16} color="success" weight="bold" />
      </LeadingCircle>
    </PopIn>
    <Animated.View entering={fadeIn(120)}>
      <Text weight={600} color="success">
        Code bestätigt
      </Text>
    </Animated.View>
  </View>
)
