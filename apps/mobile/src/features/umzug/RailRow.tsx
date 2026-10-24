import { spacing, typeScale } from '@rochade/shared'
import type { PropsWithChildren, ReactNode } from 'react'
import { View } from 'react-native'
import { useTheme } from '@/theme/useTheme'

export const railNodeSize = 28
const connectorWidth = 2
const nodeOffset = spacing.lg + (typeScale.body.lineHeight - railNodeSize) / 2

export type RailRowProps = PropsWithChildren<{
  node: ReactNode
  first: boolean
  last: boolean
  accessibilityLabel?: string
}>

export const RailRow = ({ node, first, last, accessibilityLabel, children }: RailRowProps) => {
  const { colors } = useTheme()
  const segment = (visible: boolean) => ({ width: connectorWidth, backgroundColor: visible ? colors.line : 'transparent' })
  return (
    <View
      accessible={accessibilityLabel !== undefined}
      accessibilityLabel={accessibilityLabel}
      style={{ flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.lg }}
    >
      <View style={{ width: railNodeSize, alignItems: 'center' }}>
        <View style={[segment(!first), { height: nodeOffset }]} />
        {node}
        <View style={[segment(!last), { flex: 1 }]} />
      </View>
      <View style={{ flex: 1, paddingVertical: spacing.lg, gap: spacing.xs }}>{children}</View>
    </View>
  )
}
