import { Stack, ThemeProvider } from 'expo-router'
import { useIdentity } from '@/data/IdentityProvider'
import { navigationTheme } from '@/theme/fonts'
import { formSheetOptions } from '@/theme/navigation'
import { useTheme } from '@/theme/useTheme'

export const RootNavigator = () => {
  const { identity, introDone } = useIdentity()
  const { scheme, colors } = useTheme()
  const signedOut = identity === null
  return (
    <ThemeProvider value={navigationTheme(scheme)}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }}>
        <Stack.Screen name="index" options={{ animationTypeForReplace: 'pop' }} />
        <Stack.Protected guard={signedOut && !introDone}>
          <Stack.Screen name="intro" />
        </Stack.Protected>
        <Stack.Protected guard={signedOut}>
          <Stack.Screen name="code" />
          <Stack.Screen name="anmelden" />
        </Stack.Protected>
        <Stack.Protected guard={!signedOut}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="wuensche-bearbeiten" options={formSheetOptions(colors, 'Wünsche bearbeiten')} />
          <Stack.Screen name="wohnung" options={{ ...formSheetOptions(colors, 'Rochade-Wohnung'), sheetAllowedDetents: [0.6, 1] }} />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  )
}
