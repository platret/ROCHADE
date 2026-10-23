import { Stack, ThemeProvider } from 'expo-router'
import { useIdentity } from '@/data/IdentityProvider'
import { navigationTheme } from '@/theme/fonts'
import { formSheetOptions } from '@/theme/navigation'
import { useTheme } from '@/theme/useTheme'

export const RootNavigator = () => {
  const { identity } = useIdentity()
  const { scheme, colors } = useTheme()
  return (
    <ThemeProvider value={navigationTheme(scheme)}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }}>
        <Stack.Protected guard={identity === null}>
          <Stack.Screen name="anmelden" />
        </Stack.Protected>
        <Stack.Protected guard={identity !== null}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="wuensche-bearbeiten" options={formSheetOptions(colors, 'Wünsche bearbeiten')} />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  )
}
