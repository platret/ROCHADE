import type { ColorName } from '@rochade/shared'
import { View } from 'react-native'
import { useTheme } from '@/theme/useTheme'

export type DotProps = { size: number; color: ColorName }

export const Dot = ({ size, color }: DotProps) => {
  const { colors } = useTheme()
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors[color] }} />
}
