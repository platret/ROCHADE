import { spacing, typeScale, type ColorName } from '@rochade/shared'
import type { SFSymbol } from 'expo-symbols'
import { View } from 'react-native'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { Icon } from '@/ui/Icon'
import { Text } from '@/ui/Text'

export type NoticeAction = { label: string; onPress: () => void }

export type ActionNoticeProps = {
  symbol: SFSymbol
  color: ColorName
  title: string
  body?: string
  action?: NoticeAction
  alert?: boolean
}

const iconSize = 20
const iconOffset = (typeScale.body.lineHeight - iconSize) / 2

export const ActionNotice = ({ symbol, color, title, body, action, alert = false }: ActionNoticeProps) => (
  <Card
    accessibilityRole={alert ? 'alert' : undefined}
    accessibilityLiveRegion="polite"
    style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}
  >
    <Icon name={symbol} size={iconSize} color={color} style={{ marginTop: iconOffset }} />
    <View style={{ flex: 1, gap: spacing.xs }}>
      <Text weight={600}>{title}</Text>
      {body ? (
        <Text variant="bodySm" color="inkMuted">
          {body}
        </Text>
      ) : null}
      {action ? (
        <Button
          variant="ghost"
          label={action.label}
          onPress={action.onPress}
          style={{
            alignSelf: 'flex-start',
            minHeight: 44,
            paddingHorizontal: spacing.md,
            marginLeft: -spacing.md,
            marginBottom: -spacing.sm,
          }}
        />
      ) : null}
    </View>
  </Card>
)
