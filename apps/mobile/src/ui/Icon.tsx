import type { ColorName } from '@rochade/shared'
import { SymbolView, type SFSymbol, type SymbolType, type SymbolWeight } from 'expo-symbols'
import type { StyleProp, ViewStyle } from 'react-native'
import { useTheme } from '@/theme/useTheme'

export type IconProps = {
  name: SFSymbol
  size?: number
  color?: ColorName
  weight?: SymbolWeight
  type?: SymbolType
  style?: StyleProp<ViewStyle>
}

export const Icon = ({ name, size = 20, color = 'ink', weight = 'regular', type = 'monochrome', style }: IconProps) => {
  const { colors } = useTheme()
  return <SymbolView name={name} size={size} tintColor={colors[color]} weight={weight} type={type} style={style} />
}
