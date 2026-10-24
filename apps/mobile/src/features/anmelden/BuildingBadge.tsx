import { View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { Text } from '@/ui/Text'

export type BuildingBadgeProps = { building: string }

const badgeSize = 18
const badgeOverlap = 3
const maxMarkLength = 2

export const buildingMark = (building: string) => {
  const mark = building.replace(/^Haus\s+/i, '').trim()
  return mark.length > 0 && mark.length <= maxMarkLength ? mark : null
}

export const BuildingBadge = ({ building }: BuildingBadgeProps) => {
  const { colors } = useTheme()
  const mark = buildingMark(building)
  if (mark === null) return null
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        right: -badgeOverlap,
        bottom: -badgeOverlap,
        width: badgeSize,
        height: badgeSize,
        borderRadius: badgeSize / 2,
        borderWidth: 1.5,
        borderColor: colors.line,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text variant="caption" weight={700} maxFontSizeMultiplier={1} style={{ lineHeight: 14 }}>
        {mark}
      </Text>
    </View>
  )
}
