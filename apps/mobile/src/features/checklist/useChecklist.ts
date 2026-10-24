import { useState } from 'react'
import { readChecklist, writeChecklist } from '@/lib/checklistStore'
import { haptics } from '@/lib/haptics'
import type { ChecklistItem } from './items'

export const useChecklist = (householdId: string, items: ChecklistItem[]) => {
  const [doneIds, setDoneIds] = useState(() => readChecklist(householdId))
  const isDone = (id: string) => doneIds.includes(id)
  const doneCount = items.filter((item) => isDone(item.id)).length
  const complete = items.length > 0 && doneCount === items.length

  const save = (next: string[]) => {
    setDoneIds(next)
    writeChecklist(householdId, next)
  }

  const toggle = (id: string) => {
    const next = isDone(id) ? doneIds.filter((doneId) => doneId !== id) : [...doneIds, id]
    const finished = items.every((item) => next.includes(item.id))
    if (finished) haptics.success()
    else haptics.selection()
    save(next)
  }

  const reset = () => save([])

  return { isDone, doneCount, complete, toggle, reset }
}
