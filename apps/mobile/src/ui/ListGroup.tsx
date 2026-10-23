import { radius, spacing } from '@rochade/shared'
import { Children, Fragment, type ReactNode } from 'react'
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import { useTheme } from '@/theme/useTheme'

export const listLeadingSize = 40
export const listDividerInset = spacing.lg + listLeadingSize + spacing.md

export type ListGroupProps = {
  children: ReactNode
  dividerInset?: number
  style?: StyleProp<ViewStyle>
}

export const ListGroup = ({ children, dividerInset = listDividerInset, style }: ListGroupProps) => {
  const { colors } = useTheme()
  const rows = Children.toArray(children)
  return (
    <View
      style={[
        { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, overflow: 'hidden' },
        style,
      ]}
    >
      {rows.map((row, index) => (
        <Fragment key={index}>
          {index > 0 && <View style={{ height: StyleSheet.hairlineWidth, marginLeft: dividerInset, backgroundColor: colors.line }} />}
          {row}
        </Fragment>
      ))}
    </View>
  )
}
