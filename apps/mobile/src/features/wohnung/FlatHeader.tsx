import { radius, spacing, type Flat } from '@rochade/shared'
import { View } from 'react-native'
import { FlatChips, FlatHero, flatPlace } from '@/features/umzug/stepContent'
import { useTheme } from '@/theme/useTheme'
import { Icon } from '@/ui/Icon'
import { LeadingCircle } from '@/ui/LeadingCircle'
import { Text } from '@/ui/Text'

export type FlatHeaderProps = { flat: Flat }

const iconCircle = 48

export const FlatHeader = ({ flat }: FlatHeaderProps) => {
  const { colors } = useTheme()
  return (
    <View style={{ gap: spacing.sm }}>
      <View
        accessible
        accessibilityRole="header"
        accessibilityLabel={`${flat.label}, ${flatPlace(flat)}`}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          padding: spacing.lg,
          borderRadius: radius.md,
          backgroundColor: colors.slateSoft,
        }}
      >
        <View style={{ flex: 1, gap: spacing.xs }}>
          <FlatHero flat={flat} />
          <Text color="inkMuted">{flatPlace(flat)}</Text>
        </View>
        <LeadingCircle size={iconCircle} color="surface">
          <Icon name="key.fill" size={22} color="slate" />
        </LeadingCircle>
      </View>
      <FlatChips flat={flat} schoolDistrict />
    </View>
  )
}
