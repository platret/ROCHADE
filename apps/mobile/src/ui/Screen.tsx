import { gutter, spacing } from '@rochade/shared'
import type { PropsWithChildren } from 'react'
import { RefreshControl, ScrollView, type StyleProp, type ViewStyle } from 'react-native'
import { useTheme } from '@/theme/useTheme'

export type ScreenProps = PropsWithChildren<{
  refreshing?: boolean
  onRefresh?: () => void
  contentStyle?: StyleProp<ViewStyle>
}>

export const Screen = ({ children, refreshing = false, onRefresh, contentStyle }: ScreenProps) => {
  const { colors } = useTheme()
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.paper }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[{ paddingHorizontal: gutter, paddingTop: spacing.sm, paddingBottom: spacing.xxl }, contentStyle]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      refreshControl={
        onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.inkMuted} /> : undefined
      }
    >
      {children}
    </ScrollView>
  )
}
