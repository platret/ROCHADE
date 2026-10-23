import { colors, type ColorScheme, type Palette } from '@rochade/shared'
import { useColorScheme } from 'react-native'

export type AppTheme = { scheme: ColorScheme; colors: Palette }

export const useTheme = (): AppTheme => {
  const scheme: ColorScheme = useColorScheme() === 'dark' ? 'dark' : 'light'
  return { scheme, colors: colors[scheme] }
}
