import { spacing, type ColorName } from '@rochade/shared'
import type { SFSymbol } from 'expo-symbols'
import type { ReactNode } from 'react'
import { View } from 'react-native'
import { Icon } from '@/ui/Icon'
import { Text } from '@/ui/Text'

const iconSize = 20

export const profilDividerInset = spacing.lg + iconSize + spacing.md

export type ProfilRowProps = {
  symbol: SFSymbol
  label: string
  value: ReactNode
  spoken: string
  detail?: string
  muted?: boolean
  tint?: ColorName
  trailing?: ReactNode
}

export const ProfilRow = ({ symbol, label, value, spoken, detail, muted = false, tint = 'inkMuted', trailing }: ProfilRowProps) => (
  <View
    style={{
      minHeight: 64,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingLeft: spacing.lg,
      paddingRight: trailing ? spacing.sm : spacing.lg,
    }}
  >
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${spoken}`}
      style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md }}
    >
      <Icon name={symbol} size={iconSize} color={tint} />
      <View style={{ flex: 1, gap: spacing.xs }}>
        <Text variant="label" color="inkMuted">
          {label}
        </Text>
        <Text weight={600} color={muted ? 'inkMuted' : 'ink'}>
          {value}
        </Text>
        {detail ? (
          <Text variant="monoSm" color="inkMuted">
            {detail}
          </Text>
        ) : null}
      </View>
    </View>
    {trailing}
  </View>
)
