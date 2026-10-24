import type { SFSymbol } from 'expo-symbols'
import { Tabs } from 'expo-router'
import { useIdentity } from '@/data/IdentityProvider'
import { isVerwaltung, umzugTabTitle } from '@/features/navigation/umzugTab'
import { fontFamilyFor } from '@/theme/fonts'
import { useTheme } from '@/theme/useTheme'
import { Icon } from '@/ui/Icon'

const tabIcon =
  (name: SFSymbol) =>
  ({ focused }: { focused: boolean }) => <Icon name={name} size={24} color={focused ? 'orangeStrong' : 'inkMuted'} />

export default function TabsLayout() {
  const { colors } = useTheme()
  const { identity } = useIdentity()
  const verwaltung = isVerwaltung(identity)
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.orangeStrong,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line },
        tabBarLabelStyle: { fontFamily: fontFamilyFor(600) },
      }}
    >
      <Tabs.Screen
        name="umzug"
        options={{ title: umzugTabTitle(identity), tabBarIcon: tabIcon(verwaltung ? 'list.bullet.rectangle' : 'house') }}
      />
      <Tabs.Screen
        name="wuensche"
        options={{ title: 'Meine Wünsche', href: verwaltung ? null : undefined, tabBarIcon: tabIcon('slider.horizontal.3') }}
      />
      <Tabs.Screen name="siedlung" options={{ title: 'Siedlung', tabBarIcon: tabIcon('calendar') }} />
    </Tabs>
  )
}
