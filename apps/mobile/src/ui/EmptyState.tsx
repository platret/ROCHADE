import { spacing } from '@rochade/shared'
import type { SFSymbol } from 'expo-symbols'
import { Button, type ButtonVariant } from './Button'
import { Card } from './Card'
import { Icon } from './Icon'
import { Text } from './Text'

export type StateAction = { label: string; onPress: () => void; loading?: boolean; variant?: ButtonVariant }

export type EmptyStateProps = {
  symbol: SFSymbol
  title: string
  body: string
  detail?: string
  action?: StateAction
}

export const EmptyState = ({ symbol, title, body, detail, action }: EmptyStateProps) => (
  <Card style={{ padding: spacing.xl }} accessibilityLiveRegion="polite">
    <Icon name={symbol} size={28} color="inkMuted" />
    <Text variant="h3" accessibilityRole="header" style={{ marginTop: spacing.md }}>
      {title}
    </Text>
    <Text color="inkMuted" style={{ marginTop: spacing.sm }}>
      {body}
    </Text>
    {detail ? (
      <Text variant="caption" color="inkMuted" style={{ marginTop: spacing.sm }}>
        {detail}
      </Text>
    ) : null}
    {action ? (
      <Button
        label={action.label}
        onPress={action.onPress}
        loading={action.loading}
        variant={action.variant}
        style={{ marginTop: spacing.lg }}
      />
    ) : null}
  </Card>
)
