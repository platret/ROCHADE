import { useProject } from '@/data/ProjectProvider'
import { formatTimestamp } from '@/lib/time'
import { Text } from '@/ui/Text'

const monoCaption = { fontSize: 12, lineHeight: 16 }

export const StandLine = () => {
  const project = useProject()
  if (project.status !== 'ready') return null
  const stamp = formatTimestamp(project.updatedAt)
  return (
    <Text variant="caption" color="inkMuted" accessibilityLabel={project.refreshing ? 'Aktualisiere' : `Stand ${stamp}`}>
      {project.refreshing ? (
        'Aktualisiere …'
      ) : (
        <>
          {'Stand '}
          <Text variant="monoSm" color="inkMuted" style={monoCaption}>
            {stamp}
          </Text>
        </>
      )}
    </Text>
  )
}
