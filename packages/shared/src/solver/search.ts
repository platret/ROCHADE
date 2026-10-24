import { periodsOverlap } from '../format/date'
import type { Flat, Period, UUID } from '../types'
import { lowerBound, type IsFree } from './bound'
import type { Task } from './tasks'

export const nodeLimit = 200_000

export const search = (tasks: Task[], limit = nodeLimit): (Flat | null)[] => {
  const occupied = new Map<UUID, Period[]>()
  const current: (Flat | null)[] = tasks.map(() => null)
  let best = [...current]
  let bestCost = tasks.reduce((sum, task) => sum + task.unassignedCost, 0)
  let nodes = 0

  const isFree: IsFree = (flatId, period) =>
    !(occupied.get(flatId) ?? []).some((taken) => periodsOverlap(taken, period))

  const visit = (index: number, cost: number) => {
    if (nodes++ >= limit || lowerBound(tasks, index, cost, isFree) >= bestCost) return
    const task = tasks[index]
    if (!task) {
      best = [...current]
      bestCost = cost
      return
    }
    for (const { flat, score } of task.candidates) {
      if (!isFree(flat.id, task.period)) continue
      const taken = occupied.get(flat.id) ?? []
      occupied.set(flat.id, [...taken, task.period])
      current[index] = flat
      visit(index + 1, cost - score)
      occupied.set(flat.id, taken)
    }
    current[index] = null
    visit(index + 1, cost + task.unassignedCost)
  }

  visit(0, 0)
  return best
}
