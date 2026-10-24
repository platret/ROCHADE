import { spacing, wordmark } from '@rochade/shared'
import { View } from 'react-native'
import { Logo } from './Logo'
import { Text } from './Text'

export type WordmarkProps = { logoSize?: number; fontSize?: number }

export const Wordmark = ({ logoSize = 40, fontSize = 32 }: WordmarkProps) => (
  <View
    accessible
    accessibilityRole="image"
    accessibilityLabel={wordmark.text}
    style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}
  >
    <Logo size={logoSize} />
    <Text
      variant="h1"
      weight={wordmark.weight}
      style={{ fontSize, lineHeight: Math.round(fontSize * 1.2), letterSpacing: fontSize * wordmark.letterSpacingEm }}
    >
      {wordmark.text}
    </Text>
  </View>
)
