import { planUpdatedTitle } from '@rochade/shared'
import { useEffect, useRef } from 'react'
import { AccessibilityInfo } from 'react-native'
import type { AssignmentChange } from '@/data/assignmentChanges'
import { haptics } from '@/lib/haptics'

const feedbackFor = (batch: AssignmentChange[]) => {
  const status = batch.find((change) => change.field === 'status')?.to
  if (status === 'ok') haptics.success()
  else if (status === 'conflict') haptics.warning()
  else haptics.impact('medium')
}

export const useChangeFeedback = (changes: AssignmentChange[]) => {
  const newestAt = changes[0]?.at.getTime() ?? null
  const handled = useRef(newestAt)

  useEffect(() => {
    if (newestAt === null || handled.current === newestAt) return
    handled.current = newestAt
    feedbackFor(changes.filter((change) => change.at.getTime() === newestAt))
    AccessibilityInfo.announceForAccessibility(planUpdatedTitle)
  }, [changes, newestAt])
}
