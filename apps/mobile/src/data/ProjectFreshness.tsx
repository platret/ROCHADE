import { OfflineStrip } from '@/ui/OfflineStrip'
import { StandLine } from '@/ui/StandLine'
import { useProject } from './ProjectProvider'

export const ProjectFreshness = () => {
  const project = useProject()
  if (project.status !== 'ready') return null
  const offline = project.error !== null
  return (
    <>
      <StandLine updatedAt={project.updatedAt} busy={project.refreshing || (project.stale && !offline)} />
      {offline && <OfflineStrip updatedAt={project.updatedAt} retry={project.reload} retrying={project.refreshing} />}
    </>
  )
}
