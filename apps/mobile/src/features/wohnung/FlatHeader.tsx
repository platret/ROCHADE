import { spacing, type Flat } from '@rochade/shared'
import { View } from 'react-native'
import { FlatChips, FlatHero, flatPlace } from '@/features/umzug/stepContent'
import { Text } from '@/ui/Text'

export type FlatHeaderProps = { flat: Flat }

export const FlatHeader = ({ flat }: FlatHeaderProps) => (
  <View style={{ gap: spacing.xs }}>
    <View accessible accessibilityRole="header" accessibilityLabel={`${flat.label}, ${flatPlace(flat)}`} style={{ gap: spacing.xs }}>
      <FlatHero flat={flat} />
      <Text color="inkMuted">{flatPlace(flat)}</Text>
    </View>
    <FlatChips flat={flat} schoolDistrict />
  </View>
)
