import { AccessibilityInfo } from 'react-native'
import type { AssignmentChange } from '@/data/assignmentChanges'
import { useChangeBatch } from '@/data/useChangeBatch'
import { haptics } from '@/lib/haptics'
import { bannerTitle } from './changes'

export const useBatchFeedback = (changes: AssignmentChange[], lastChangeAt: Date | null) =>
  useChangeBatch(changes, lastChangeAt, () => {
    haptics.impact('medium')
    AccessibilityInfo.announceForAccessibility(bannerTitle(changes.length))
  })
