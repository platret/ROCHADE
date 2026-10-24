import { formatDate, spacing, type ColorName } from '@rochade/shared'
import { Pressable, StyleSheet, View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { Icon } from '@/ui/Icon'
import { Text } from '@/ui/Text'
import { dueLabel, type ChecklistItem } from './items'

export type ChecklistRowProps = { item: ChecklistItem; done: boolean; overdue: boolean; onToggle: () => void }

export const checkboxSize = 24
const dividerInset = spacing.lg + checkboxSize + spacing.md

export const ChecklistRow = ({ item, done, overdue, onToggle }: ChecklistRowProps) => {
  const { colors } = useTheme()
  const late = overdue && !done
  const dateColor: ColorName = late ? 'danger' : 'inkMuted'
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={`${item.title}, ${dueLabel(item)}${late ? ', überfällig' : ''}`}
      style={({ pressed }) => ({
        minHeight: 64,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        backgroundColor: pressed ? colors.surfaceSunken : 'transparent',
      })}
    >
      <Icon name={done ? 'checkmark.circle.fill' : 'circle'} size={checkboxSize} color={done ? 'ink' : 'lineStrong'} />
      <View style={{ flex: 1, gap: spacing.xs }}>
        <Text color={done ? 'inkMuted' : 'ink'}>{item.title}</Text>
        <Text variant="bodySm" color={dateColor}>
          {`${item.kind} `}
          <Text variant="monoSm" color={dateColor}>
            {formatDate(item.due)}
          </Text>
        </Text>
      </View>
    </Pressable>
  )
}

export const ChecklistDivider = () => {
  const { colors } = useTheme()
  return <View style={{ height: StyleSheet.hairlineWidth, marginLeft: dividerInset, backgroundColor: colors.line }} />
}
