import { planUpdatedTitle } from '@rochade/shared'
import { AccessibilityInfo } from 'react-native'
import type { AssignmentChange } from '@/data/assignmentChanges'
import { useChangeBatch } from '@/data/useChangeBatch'
import { haptics } from '@/lib/haptics'

const feedbackFor = (batch: AssignmentChange[]) => {
  const status = batch.find((change) => change.field === 'status')?.to
  if (status === 'ok') haptics.success()
  else if (status === 'conflict') haptics.warning()
  else haptics.impact('medium')
  AccessibilityInfo.announceForAccessibility(planUpdatedTitle)
}

export const useChangeFeedback = (changes: AssignmentChange[], lastChangeAt: Date | null) => useChangeBatch(changes, lastChangeAt, feedbackFor)
