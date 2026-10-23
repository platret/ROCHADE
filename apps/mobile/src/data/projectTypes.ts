import type { ProjectData } from '@rochade/shared'
import type { AssignmentChange } from './assignmentChanges'

export type ProjectState =
  | { status: 'unconfigured' }
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'ready'; data: ProjectData; updatedAt: Date; error: string | null }

export type ProjectStatus = ProjectState['status']

export type ProjectContextValue = ProjectState & {
  refreshing: boolean
  reload: () => void
  changes: AssignmentChange[]
  lastChangeAt: Date | null
  dismissChanges: (householdId: string) => void
}
