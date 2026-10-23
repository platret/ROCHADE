import { radius, spacing, type ColorName } from '@rochade/shared'
import { View, type ViewProps } from 'react-native'
import { useTheme } from '@/theme/useTheme'

export type CardTone = 'surface' | 'sunken' | 'orangeSoft' | 'successSoft' | 'dangerSoft'

export type CardProps = ViewProps & { tone?: CardTone }

const backgrounds: Record<CardTone, ColorName> = {
  surface: 'surface',
  sunken: 'surfaceSunken',
  orangeSoft: 'orangeSoft',
  successSoft: 'successSoft',
  dangerSoft: 'dangerSoft',
}

export const Card = ({ tone = 'surface', style, ...rest }: CardProps) => {
  const { colors } = useTheme()
  return (
    <View
      {...rest}
      style={[
        { backgroundColor: colors[backgrounds[tone]], borderRadius: radius.md, padding: spacing.lg },
        tone === 'surface' && { borderWidth: 1, borderColor: colors.line },
        style,
      ]}
    />
  )
}
