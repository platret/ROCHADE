import { gutter, spacing } from '@rochade/shared'
import type { PropsWithChildren } from 'react'
import { RefreshControl, ScrollView, type StyleProp, type ViewStyle } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { ScrollEventsContext, useScrollEvents } from './scrollEvents'
import { EnteredContext, useScreenEntered } from './useEntered'
import { usePullToRefresh } from './usePullToRefresh'

export type ScreenProps = PropsWithChildren<{
  refreshing?: boolean
  onRefresh?: () => void
  contentStyle?: StyleProp<ViewStyle>
}>

export const Screen = ({ children, refreshing = false, onRefresh, contentStyle }: ScreenProps) => {
  const { colors } = useTheme()
  const { pulling, pull } = usePullToRefresh(refreshing, onRefresh)
  const entered = useScreenEntered()
  const { subscribe, onScroll } = useScrollEvents()
  return (
    <EnteredContext value={entered}>
      <ScrollEventsContext value={subscribe}>
        <ScrollView
          style={{ flex: 1, backgroundColor: colors.paper }}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={[{ paddingHorizontal: gutter, paddingTop: spacing.sm, paddingBottom: spacing.xxl }, contentStyle]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScroll={onScroll}
          scrollEventThrottle={48}
          refreshControl={onRefresh ? <RefreshControl refreshing={pulling} onRefresh={pull} tintColor={colors.inkMuted} /> : undefined}
        >
          {children}
        </ScrollView>
      </ScrollEventsContext>
    </EnteredContext>
  )
}
