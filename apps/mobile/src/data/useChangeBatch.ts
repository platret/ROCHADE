import { useEffect, useRef } from 'react'
import type { AssignmentChange } from './assignmentChanges'

export const useChangeBatch = (changes: AssignmentChange[], lastChangeAt: Date | null, onBatch: (batch: AssignmentChange[]) => void) => {
  const at = lastChangeAt?.getTime() ?? null
  const handled = useRef(at)

  useEffect(() => {
    if (at === null || handled.current === at) return
    handled.current = at
    const batch = changes.filter((change) => change.at.getTime() === at)
    if (batch.length > 0) onBatch(batch)
  }, [at, changes, onBatch])
}
