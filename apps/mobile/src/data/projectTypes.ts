import type { ProjectData } from '@rochade/shared'
import type { AssignmentChange } from './assignmentChanges'

export type ProjectState =
  | { status: 'unconfigured' }
  | { status: 'loading' }
  | { status: 'error'; error: string; diagnostics: string | null }
  | { status: 'ready'; data: ProjectData; updatedAt: Date; error: string | null; stale: boolean }

export type ProjectContextValue = ProjectState & {
  refreshing: boolean
  reload: () => void
  reloadSilently: () => void
  changes: AssignmentChange[]
  lastChangeAt: Date | null
  dismissChanges: (householdId?: string) => void
}
