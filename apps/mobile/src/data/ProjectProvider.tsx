import { createContext, useContext, type PropsWithChildren } from 'react'
import type { ProjectContextValue } from './projectTypes'
import { useProjectLoader } from './useProjectLoader'

const ProjectContext = createContext<ProjectContextValue | null>(null)

export const ProjectProvider = ({ children }: PropsWithChildren) => {
  const value = useProjectLoader()
  return <ProjectContext value={value}>{children}</ProjectContext>
}

export const useProject = (): ProjectContextValue => {
  const value = useContext(ProjectContext)
  if (!value) throw new Error('useProject braucht einen ProjectProvider.')
  return value
}
