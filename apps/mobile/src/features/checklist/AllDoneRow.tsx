import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import { Icon } from '@/ui/Icon'
import { PopIn } from '@/ui/PopIn'
import { Text } from '@/ui/Text'
import { checkboxSize } from './Checkbox'
import { ResetButton } from './ResetButton'

export type AllDoneRowProps = { onReset: () => void }

export const AllDoneRow = ({ onReset }: AllDoneRowProps) => (
  <View
    accessibilityLiveRegion="polite"
    style={{
      minHeight: 64,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    }}
  >
    <PopIn from={0.5}>
      <Icon name="checkmark.circle.fill" size={checkboxSize} color="ink" />
    </PopIn>
    <Text weight={600} style={{ flex: 1 }}>
      Alles erledigt
    </Text>
    <ResetButton onPress={onReset} />
  </View>
)
