import { gutter, spacing } from '@rochade/shared'
import type { PropsWithChildren } from 'react'
import { ScrollView, View } from 'react-native'
import { Text } from '@/ui/Text'

export type IntroPageProps = PropsWithChildren<{ width: number; title: string; body: string }>

const copyMinHeight = 168

export const IntroPage = ({ width, title, body, children }: IntroPageProps) => (
  <ScrollView
    style={{ width }}
    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: gutter }}
    alwaysBounceVertical={false}
    showsVerticalScrollIndicator={false}
  >
    <View style={{ flex: 1, justifyContent: 'center', paddingVertical: spacing.xl }}>{children}</View>
    <View style={{ minHeight: copyMinHeight, gap: spacing.md }}>
      <Text variant="h2" accessibilityRole="header">
        {title}
      </Text>
      <Text color="inkMuted">{body}</Text>
    </View>
  </ScrollView>
)
