import type { ColorName } from '@rochade/shared'
import type { PropsWithChildren } from 'react'
import { View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { listLeadingSize } from './ListGroup'

export type LeadingCircleProps = PropsWithChildren<{ size?: number; color?: ColorName }>

export const LeadingCircle = ({ children, size = listLeadingSize, color = 'surfaceSunken' }: LeadingCircleProps) => {
  const { colors } = useTheme()
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors[color],
      }}
    >
      {children}
    </View>
  )
}
