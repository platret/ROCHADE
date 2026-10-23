import { typeScale, type ColorName, type TypeStyle } from '@rochade/shared'
import { Text as RNText, type TextProps, type TextStyle } from 'react-native'
import { fontFamilyFor, monoFontFamily, type SansWeight } from '@/theme/fonts'
import { useTheme } from '@/theme/useTheme'

const monoScale = {
  monoSm: { fontSize: 14, lineHeight: 20, letterSpacing: -0.2 },
  mono: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  monoLarge: { fontSize: 24, lineHeight: 30, letterSpacing: 0 },
} satisfies Record<string, TextStyle>

export type TextVariant = TypeStyle | keyof typeof monoScale

export type AppTextProps = TextProps & {
  variant?: TextVariant
  weight?: SansWeight
  color?: ColorName
  align?: TextStyle['textAlign']
}

const isMono = (variant: TextVariant): variant is keyof typeof monoScale => variant in monoScale

const tightVariants = new Set<TextVariant>(['display', 'h1', 'h2', 'monoLarge'])

const styleFor = (variant: TextVariant, weight?: SansWeight): TextStyle => {
  if (isMono(variant)) return { fontFamily: monoFontFamily, ...monoScale[variant] }
  const scale = typeScale[variant]
  return { fontFamily: fontFamilyFor(weight ?? scale.weight), fontSize: scale.size, lineHeight: scale.lineHeight }
}

export const Text = ({ variant = 'body', weight, color = 'ink', align, style, ...rest }: AppTextProps) => {
  const { colors } = useTheme()
  return (
    <RNText
      maxFontSizeMultiplier={tightVariants.has(variant) ? 1.3 : 1.6}
      {...rest}
      style={[styleFor(variant, weight), { color: colors[color], textAlign: align }, style]}
    />
  )
}
