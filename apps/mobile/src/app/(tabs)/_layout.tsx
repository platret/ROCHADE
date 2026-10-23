import { NativeTabs } from 'expo-router/native-tabs'
import { useTheme } from '@/theme/useTheme'

export default function TabsLayout() {
  const { colors } = useTheme()
  return (
    <NativeTabs minimizeBehavior="onScrollDown" tintColor={colors.orangeStrong}>
      <NativeTabs.Trigger name="umzug">
        <NativeTabs.Trigger.Label>Mein Umzug</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="wuensche">
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
