import { spacing } from '@rochade/shared'
import Animated from 'react-native-reanimated'
import { fadeIn } from '@/ui/entering'
import { Icon } from '@/ui/Icon'
import { Text } from '@/ui/Text'

export type CodeErrorProps = { message: string }

export const CodeError = ({ message }: CodeErrorProps) => (
  <Animated.View
    entering={fadeIn()}
    accessibilityRole="alert"
    accessibilityLiveRegion="assertive"
    style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}
  >
    <Icon name="exclamationmark.circle.fill" size={18} color="danger" style={{ marginTop: 3 }} />
    <Text color="danger" style={{ flex: 1 }}>
      {message}
    </Text>
  </Animated.View>
)
