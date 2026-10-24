import { spacing } from '@rochade/shared'
import { Pressable } from 'react-native'
import { useProject } from '@/data/ProjectProvider'
import { formatTimestamp } from '@/lib/time'
import { Card } from '@/ui/Card'
import { Text } from '@/ui/Text'

export const OfflineStrip = () => {
  const project = useProject()
  if (project.status !== 'ready' || project.error === null) return null
  return (
    <Card
      tone="sunken"
      accessibilityLiveRegion="polite"
      style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xs }}
    >
      <Text variant="bodySm" style={{ flex: 1 }}>
        {'Offline – Stand '}
        <Text variant="monoSm">{formatTimestamp(project.updatedAt)}</Text>
      </Text>
      <Pressable
        onPress={project.reload}
        disabled={project.refreshing}
        accessibilityRole="button"
        accessibilityLabel="Erneut versuchen"
        accessibilityState={{ busy: project.refreshing }}
        hitSlop={spacing.sm}
        style={{ minHeight: 44, justifyContent: 'center' }}
      >
        <Text variant="bodySm" weight={600} color="orangeStrong">
          Erneut versuchen
        </Text>
      </Pressable>
    </Card>
  )
}
