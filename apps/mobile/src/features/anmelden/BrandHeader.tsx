import { spacing, tagline } from '@rochade/shared'
import { View } from 'react-native'
import { Text } from '@/ui/Text'
import { Wordmark } from '@/ui/Wordmark'

export const BrandHeader = () => (
  <View>
    <Wordmark />
    <Text color="inkMuted" numberOfLines={2} style={{ marginTop: spacing.sm }}>
      {tagline}
    </Text>
  </View>
)
