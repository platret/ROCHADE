import { spacing } from '@rochade/shared'
import { View, type ViewStyle } from 'react-native'
import { Icon } from '@/ui/Icon'
import { LeadingCircle } from '@/ui/LeadingCircle'
import { StaggerGroup } from '@/ui/StaggerGroup'
import { Text } from '@/ui/Text'
import type { Fact } from './welcome'

export const factCircleSize = 32
export const factDividerInset = spacing.lg + factCircleSize + spacing.md
export const factRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing.md,
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.lg,
}

const FactRow = ({ symbol, label, value, spoken, detail }: Fact) => (
  <View accessible accessibilityRole="text" accessibilityLabel={`${label}: ${spoken}${detail ? `, ${detail}` : ''}`} style={factRowStyle}>
    <LeadingCircle size={factCircleSize}>
      <Icon name={symbol} size={16} color="inkMuted" />
    </LeadingCircle>
    <View style={{ flex: 1, gap: spacing.xs }}>
      <Text variant="label" color="inkMuted">
        {label}
      </Text>
      <Text weight={600}>{value}</Text>
      {detail ? (
        <Text variant="monoSm" color="inkMuted">
          {detail}
        </Text>
      ) : null}
    </View>
  </View>
)

export type FactCardProps = { facts: Fact[]; delay: number }

export const FactCard = ({ facts, delay }: FactCardProps) => (
  <StaggerGroup delay={delay} dividerInset={factDividerInset}>
    {facts.map((fact) => (
      <FactRow key={fact.label} {...fact} />
    ))}
  </StaggerGroup>
)
