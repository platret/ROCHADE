import { formatDate, radius, spacing } from '@rochade/shared'
import type { SFSymbol } from 'expo-symbols'
import type { ReactNode } from 'react'
import { View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { Icon } from '@/ui/Icon'
import { Text } from '@/ui/Text'
import { movesFallback, type MoveFact } from './etappeFocus'

type FactProps = { symbol: SFSymbol; children: ReactNode }

const Fact = ({ symbol, children }: FactProps) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexShrink: 1 }}>
    <Icon name={symbol} size={16} color="inkMuted" />
    <Text variant="bodySm" color="inkMuted" style={{ flexShrink: 1 }}>
      {children}
    </Text>
  </View>
)

export type MoveFactsProps = { moves: MoveFact[] }

export const MoveFacts = ({ moves }: MoveFactsProps) => {
  const { colors } = useTheme()
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: spacing.lg,
        rowGap: spacing.sm,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radius.sm,
        backgroundColor: colors.surfaceSunken,
      }}
    >
      {moves.length === 0 ? (
        <Fact symbol="clock">{movesFallback}</Fact>
      ) : (
        moves.map(({ symbol, before, date, after }) => (
          <Fact key={before} symbol={symbol}>
            {before}
            <Text variant="monoSm">{formatDate(date)}</Text>
            {after}
          </Fact>
        ))
      )}
    </View>
  )
}
