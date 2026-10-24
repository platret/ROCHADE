import type { Period, UUID } from '../types'
import { comparePlain } from './order'
import type { Task } from './tasks'

export type IsFree = (flatId: UUID, period: Period) => boolean

const compareEnd = (a: Period, b: Period) => comparePlain(a.end, b.end)

const maxDisjoint = (periods: Period[]) => {
  let count = 0
  let lastEnd = ''
  for (const period of [...periods].sort(compareEnd)) {
    if (period.start > lastEnd) {
      count += 1
      lastEnd = period.end
    }
  }
  return count
}

const sumOfSmallest = (values: number[], count: number) =>
  [...values].sort((a, b) => a - b).slice(0, Math.max(0, count)).reduce((sum, value) => sum + value, 0)

export const lowerBound = (tasks: Task[], index: number, cost: number, isFree: IsFree) => {
  let bound = cost
  const increases: number[] = []
  const periodsByFlat = new Map<UUID, Period[]>()
  for (const task of tasks.slice(index)) {
    const free = task.candidates.filter(({ flat }) => isFree(flat.id, task.period))
    const best = free[0]
    if (!best) {
      bound += task.unassignedCost
      continue
    }
    bound -= best.score
    increases.push(task.unassignedCost + best.score)
    for (const { flat } of free) periodsByFlat.set(flat.id, [...(periodsByFlat.get(flat.id) ?? []), task.period])
  }
  const capacity = [...periodsByFlat.values()].reduce((sum, periods) => sum + maxDisjoint(periods), 0)
  return bound + sumOfSmallest(increases, increases.length - capacity)
}
