import { formatDate, spacing, type ColorName } from '@rochade/shared'
import { StyleSheet, View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { Tactile } from '@/ui/Tactile'
import { Text } from '@/ui/Text'
import { Checkbox, checkboxSize } from './Checkbox'
import { dueLabel, type ChecklistItem } from './items'
import { StrikeText } from './StrikeText'

export type ChecklistRowProps = { item: ChecklistItem; done: boolean; overdue: boolean; onToggle: () => void }

const dividerInset = spacing.lg + checkboxSize + spacing.md

export const ChecklistRow = ({ item, done, overdue, onToggle }: ChecklistRowProps) => {
  const late = overdue && !done
  const dateColor: ColorName = late ? 'danger' : 'inkMuted'
  return (
    <Tactile
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={`${item.title}, ${dueLabel(item)}${late ? ', überfällig' : ''}`}
      style={{
        minHeight: 64,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
      }}
    >
      <Checkbox checked={done} />
      <View style={{ flex: 1, gap: spacing.xs }}>
        <StrikeText struck={done}>{item.title}</StrikeText>
        <Text variant="bodySm" color={dateColor}>
          {`${item.kind} `}
          <Text variant="monoSm" color={dateColor}>
            {formatDate(item.due)}
          </Text>
        </Text>
      </View>
    </Tactile>
  )
}

export const ChecklistDivider = () => {
  const { colors } = useTheme()
  return <View style={{ height: StyleSheet.hairlineWidth, marginLeft: dividerInset, backgroundColor: colors.line }} />
}
