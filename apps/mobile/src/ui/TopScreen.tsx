import { spacing } from '@rochade/shared'
import type { PropsWithChildren } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/theme/useTheme'
import { Screen } from './Screen'

export type TopScreenProps = PropsWithChildren<{ contentStyle?: StyleProp<ViewStyle> }>

export const TopScreen = ({ contentStyle, children }: TopScreenProps) => {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  return (
    <View style={{ flex: 1 }}>
      <Screen contentStyle={[{ paddingTop: spacing.xxl }, contentStyle]}>{children}</Screen>
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top, backgroundColor: colors.paper, zIndex: 1 }}
      />
    </View>
  )
}
