import type { ColorName } from '@rochade/shared'
import { useId } from 'react'
import { StyleSheet } from 'react-native'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'
import { useTheme } from '@/theme/useTheme'

export type GradientProps = { color: ColorName; opacities: number[]; horizontal?: boolean }

export const Gradient = ({ color, opacities, horizontal = false }: GradientProps) => {
  const { colors } = useTheme()
  const reactId = useId()
  const id = `gradient${reactId.replace(/[^a-zA-Z0-9]/g, '')}`
  const lastIndex = Math.max(1, opacities.length - 1)
  return (
    <Svg pointerEvents="none" style={StyleSheet.absoluteFill} width="100%" height="100%">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2={horizontal ? '1' : '0'} y2={horizontal ? '0' : '1'}>
          {opacities.map((opacity, index) => (
            <Stop key={index} offset={index / lastIndex} stopColor={colors[color]} stopOpacity={opacity} />
          ))}
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  )
}
