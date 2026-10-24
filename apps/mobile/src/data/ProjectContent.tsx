import type { ProjectData } from '@rochade/shared'
import type { ReactNode } from 'react'
import { ErrorState } from '@/ui/ErrorState'
import { UnconfiguredState } from '@/ui/UnconfiguredState'
import { useProject } from './ProjectProvider'

export type ProjectContentProps = {
  skeleton: ReactNode
  errorTitle?: string
  children: (data: ProjectData) => ReactNode
}

export const ProjectContent = ({ skeleton, errorTitle, children }: ProjectContentProps) => {
  const project = useProject()
  switch (project.status) {
    case 'unconfigured':
      return <UnconfiguredState />
    case 'loading':
      return skeleton
    case 'error':
      return <ErrorState title={errorTitle} body={project.error} detail={project.diagnostics ?? undefined} retry={project.reload} />
    case 'ready':
      return children(project.data)
  }
}
