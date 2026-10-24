import type { ColorScheme } from '@rochade/shared'
import { useMediaQuery } from './useMediaQuery'

export const useColorScheme = (): ColorScheme => (useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light')
