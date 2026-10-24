import { spacing } from '@rochade/shared'
import Constants from 'expo-constants'
import { View } from 'react-native'
import { Text } from '@/ui/Text'

const version = Constants.expoConfig?.version
const versionLine = version ? `ROCHADE · Version ${version}` : 'ROCHADE'

export type ProfilFooterProps = { hint?: string }

export const ProfilFooter = ({ hint }: ProfilFooterProps) => (
  <View style={{ gap: spacing.xs, paddingHorizontal: spacing.lg }}>
    {hint ? (
      <Text variant="bodySm" color="inkMuted">
        {hint}
      </Text>
    ) : null}
    <Text variant="caption" color="inkMuted">
      {versionLine}
    </Text>
  </View>
)
