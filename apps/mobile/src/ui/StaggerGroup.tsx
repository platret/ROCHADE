import { radius, spacing } from '@rochade/shared'
import { Children, type ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useTheme } from '@/theme/useTheme'
import { fadeIn, riseIn, staggered } from './entering'
import { listLeadingSize } from './ListGroup'

export type StaggerGroupProps = { children: ReactNode; delay?: number; dividerInset?: number }

const defaultInset = spacing.lg + listLeadingSize + spacing.md

export const StaggerGroup = ({ children, delay = 0, dividerInset = defaultInset }: StaggerGroupProps) => {
  const { colors } = useTheme()
  const rows = Children.toArray(children)
  return (
    <Animated.View
      entering={fadeIn(delay)}
      style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, overflow: 'hidden' }}
    >
      {rows.map((row, index) => (
        <Animated.View key={index} entering={riseIn(staggered(index, delay))}>
          {index > 0 && <View style={{ height: StyleSheet.hairlineWidth, marginLeft: dividerInset, backgroundColor: colors.line }} />}
          {row}
        </Animated.View>
      ))}
    </Animated.View>
  )
}
