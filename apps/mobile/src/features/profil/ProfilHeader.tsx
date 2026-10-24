import { spacing } from '@rochade/shared'
import type { PropsWithChildren } from 'react'
import { View } from 'react-native'
import { LeadingCircle } from '@/ui/LeadingCircle'
import { Text } from '@/ui/Text'

export const avatarSize = 56

export type ProfilHeaderProps = PropsWithChildren<{ title: string; subtitle: string }>

export const ProfilHeader = ({ title, subtitle, children }: ProfilHeaderProps) => (
  <View
    accessible
    accessibilityRole="header"
    accessibilityLabel={`${title}, ${subtitle}`}
    style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}
  >
    <LeadingCircle size={avatarSize} color="orangeSoft">
      {children}
    </LeadingCircle>
    <View style={{ flex: 1, gap: spacing.xs }}>
      <Text variant="h2">{title}</Text>
      <Text variant="bodySm" color="inkMuted">
        {subtitle}
      </Text>
    </View>
  </View>
)

export const Initials = ({ text }: { text: string }) => (
  <Text variant="h3" weight={700} color="orangeStrong" maxFontSizeMultiplier={1.3}>
    {text}
  </Text>
)
