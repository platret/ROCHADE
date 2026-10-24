import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import { Text } from '@/ui/Text'

export type SectionHeaderProps = { title: string; meta?: string; subtitle?: string }

export const SectionHeader = ({ title, meta, subtitle }: SectionHeaderProps) => (
  <View style={{ gap: spacing.xs }}>
    <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: spacing.md }}>
      <Text variant="h3" accessibilityRole="header">
        {title}
      </Text>
      {meta ? (
        <Text variant="bodySm" color="inkMuted">
          {meta}
        </Text>
      ) : null}
    </View>
    {subtitle ? (
      <Text variant="bodySm" color="inkMuted">
        {subtitle}
      </Text>
    ) : null}
  </View>
)
