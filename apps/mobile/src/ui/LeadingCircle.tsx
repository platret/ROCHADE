import type { PropsWithChildren } from 'react'
import { View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { listLeadingSize } from './ListGroup'

export type LeadingCircleProps = PropsWithChildren<{ size?: number }>

export const LeadingCircle = ({ children, size = listLeadingSize }: LeadingCircleProps) => {
  const { colors } = useTheme()
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surfaceSunken,
      }}
    >
      {children}
    </View>
  )
}
