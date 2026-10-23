import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono/500Medium'
import { Manrope_400Regular } from '@expo-google-fonts/manrope/400Regular'
import { Manrope_600SemiBold } from '@expo-google-fonts/manrope/600SemiBold'
import { Manrope_700Bold } from '@expo-google-fonts/manrope/700Bold'
import { Manrope_800ExtraBold } from '@expo-google-fonts/manrope/800ExtraBold'
import { colors, type ColorScheme } from '@rochade/shared'
import { DarkTheme, DefaultTheme, type Theme } from 'expo-router'

export const fontMap = { Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold, JetBrainsMono_500Medium }

export type SansWeight = 400 | 600 | 700 | 800

const sansFamilies: Record<SansWeight, string> = {
  400: 'Manrope_400Regular',
  600: 'Manrope_600SemiBold',
  700: 'Manrope_700Bold',
  800: 'Manrope_800ExtraBold',
}

export const fontFamilyFor = (weight: SansWeight) => sansFamilies[weight]

export const monoFontFamily = 'JetBrainsMono_500Medium'

export const navigationTheme = (scheme: ColorScheme): Theme => {
  const palette = colors[scheme]
  return {
    ...(scheme === 'dark' ? DarkTheme : DefaultTheme),
    dark: scheme === 'dark',
    colors: {
      primary: palette.orangeStrong,
      background: palette.paper,
      card: palette.surface,
      text: palette.ink,
      border: palette.line,
      notification: palette.danger,
    },
  }
}
