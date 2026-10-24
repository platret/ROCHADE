import type { PropsWithChildren, ReactNode } from 'react'
import { View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { listLeadingSize } from './ListGroup'

export type RingCircleProps = PropsWithChildren<{ size?: number; badge?: ReactNode }>

const ringWidth = 2

export const RingCircle = ({ size = listLeadingSize, badge, children }: RingCircleProps) => {
  const { colors } = useTheme()
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: ringWidth,
          borderColor: colors.line,
          backgroundColor: colors.surfaceSunken,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </View>
      {badge}
    </View>
  )
}
