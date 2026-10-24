import { NativeTabs } from 'expo-router/native-tabs'
import { useIdentity } from '@/data/IdentityProvider'
import { isVerwaltung, umzugTabTitle } from '@/features/navigation/umzugTab'
import { useTheme } from '@/theme/useTheme'

export default function TabsLayout() {
  const { colors } = useTheme()
  const { identity } = useIdentity()
  const verwaltung = isVerwaltung(identity)
  return (
    <NativeTabs minimizeBehavior="onScrollDown" tintColor={colors.orangeStrong}>
      <NativeTabs.Trigger name="umzug">
        <NativeTabs.Trigger.Label>{umzugTabTitle(identity)}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={
            verwaltung
              ? { default: 'list.bullet.rectangle', selected: 'list.bullet.rectangle.fill' }
              : { default: 'house', selected: 'house.fill' }
          }
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="wuensche" hidden={verwaltung}>
        <NativeTabs.Trigger.Label>Meine Wünsche</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="slider.horizontal.3" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="siedlung">
        <NativeTabs.Trigger.Label>Siedlung</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="calendar" />
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
