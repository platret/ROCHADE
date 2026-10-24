import { spacing } from '@rochade/shared'
import type { SFSymbol } from 'expo-symbols'
import { View } from 'react-native'
import { Icon } from '@/ui/Icon'
import { LeadingCircle } from '@/ui/LeadingCircle'
import { Text } from '@/ui/Text'

export type SummaryRowProps = {
  symbol: SFSymbol
  label: string
  value: string | null
  empty?: string
  prose?: boolean
}

export const summaryLeadingSize = 32
export const summaryDividerInset = spacing.lg + summaryLeadingSize + spacing.md

const valueBlockHeight = 44
export const summaryLeadingOffset = (valueBlockHeight - summaryLeadingSize) / 2

export const SummaryRow = ({ symbol, label, value, empty = 'Keine Angabe', prose = false }: SummaryRowProps) => {
  const shown = value && value.trim().length > 0 ? value : null
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${shown ?? empty}`}
      style={{
        minHeight: 68,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
      }}
    >
      <View style={{ marginTop: summaryLeadingOffset }}>
        <LeadingCircle size={summaryLeadingSize}>
          <Icon name={symbol} size={16} color="inkMuted" />
        </LeadingCircle>
      </View>
      <View style={{ flex: 1, gap: spacing.xs }}>
        <Text variant="label" color="inkMuted">
          {label}
        </Text>
        <Text variant={prose ? 'body' : 'h3'} color={shown ? 'ink' : 'inkMuted'}>
          {shown ?? empty}
        </Text>
      </View>
    </View>
  )
}
