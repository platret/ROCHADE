import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { IdentityProvider } from '@/data/IdentityProvider'
import { ProjectProvider } from '@/data/ProjectProvider'
import { RootNavigator } from '@/features/navigation/RootNavigator'
import { fontMap } from '@/theme/fonts'

void SplashScreen.preventAutoHideAsync()
SplashScreen.setOptions({ duration: 400, fade: true })

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontMap)
  const ready = fontsLoaded || fontError !== null

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync()
  }, [ready])

  if (!ready) return null

  return (
    <IdentityProvider>
      <ProjectProvider>
        <RootNavigator />
      </ProjectProvider>
    </IdentityProvider>
  )
}
