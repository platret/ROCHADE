import type { ColorName } from '@rochade/shared'
import { SymbolView, type SFSymbol, type SymbolType, type SymbolWeight } from 'expo-symbols'
import { View, type StyleProp, type ViewStyle } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { materialSymbolFor } from './materialSymbols'

export type IconProps = {
  name: SFSymbol
  size?: number
  color?: ColorName
  weight?: SymbolWeight
  type?: SymbolType
  style?: StyleProp<ViewStyle>
}

export const Icon = ({ name, size = 20, color = 'ink', style }: IconProps) => {
  const { colors } = useTheme()
  const material = materialSymbolFor(name)
  if (!material) return <View aria-hidden style={[{ width: size, height: size }, style]} />
  return <SymbolView name={{ web: material }} size={size} tintColor={colors[color]} style={style} />
}
