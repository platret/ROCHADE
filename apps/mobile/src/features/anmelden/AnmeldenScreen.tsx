import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/theme/useTheme'
import { Screen } from '@/ui/Screen'
import { AnmeldenBody } from './AnmeldenBody'

export const AnmeldenScreen = () => {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  return (
    <View style={{ flex: 1 }}>
      <Screen contentStyle={{ paddingTop: spacing.xxl }}>
        <AnmeldenBody />
      </Screen>
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top, backgroundColor: colors.paper, zIndex: 1 }}
      />
    </View>
  )
}
