import { Stack } from 'expo-router'
import { largeTitleOptions } from '@/theme/navigation'
import { useTheme } from '@/theme/useTheme'

export type TabStackProps = { title: string }

export const TabStack = ({ title }: TabStackProps) => {
  const { colors } = useTheme()
  return (
    <Stack screenOptions={largeTitleOptions(colors)}>
      <Stack.Screen name="index" options={{ title }} />
    </Stack>
  )
}
