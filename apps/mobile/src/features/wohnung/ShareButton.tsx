import { spacing } from '@rochade/shared'
import { useState } from 'react'
import { View } from 'react-native'
import { sharePlan } from '@/lib/share'
import { Button } from '@/ui/Button'
import { Text } from '@/ui/Text'
import type { WohnungPlan } from './plan'

export type ShareButtonProps = { plan: WohnungPlan }

export const ShareButton = ({ plan }: ShareButtonProps) => {
  const [failed, setFailed] = useState(false)

  const share = () => {
    setFailed(false)
    sharePlan(plan).catch(() => setFailed(true))
  }

  return (
    <View style={{ gap: spacing.sm }}>
      <Button variant="secondary" label="Plan teilen" icon="square.and.arrow.up" onPress={share} />
      {failed && (
        <Text variant="bodySm" color="danger" accessibilityRole="alert">
          Teilen hat nicht geklappt. Versuche es erneut.
        </Text>
      )}
    </View>
  )
}
