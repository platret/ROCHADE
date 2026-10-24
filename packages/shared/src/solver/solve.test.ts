import { describe, expect, it } from 'vitest'
import { demoFlats, demoHouseholds, demoIds, demoPhases } from '../demo/seed-data'
import { addDays, periodsOverlap } from '../format/date'
import { solve } from './solve'
import { assignmentOf } from './test-builders'
import type { SolveInput, SolveResult } from './types'

const fixture: SolveInput = { phases: demoPhases, flats: demoFlats, households: demoHouseholds }
const brunnerReason = 'Für Herrn Brunner fehlt vom 01.09.2027 bis 30.11.2027 eine hindernisfreie 2-Zimmer-Wohnung.'

const shiftPhase3 = (days: number): SolveInput => ({
  ...fixture,
  phases: demoPhases.map((phase) =>
    phase.id === demoIds.phase3
      ? { ...phase, start_date: addDays(phase.start_date, days), end_date: addDays(phase.end_date, days) }
      : phase,
  ),
})

const doubleBookings = ({ assignments }: SolveResult) => {
  const placed = assignments.filter((a) => a.status === 'ok').map((a) => ({ flat: a.temp_flat_id, start: a.move_out ?? '', end: a.move_back ?? '' }))
  return placed.filter((a, index) => placed.slice(index + 1).some((b) => a.flat === b.flat && periodsOverlap(a, b)))
}

describe('solve with the demo fixture', () => {
  const result = solve(fixture)

  it('places every Haus A household without double bookings', () => {
    const hausA = demoHouseholds.filter((h) => demoFlats.find((f) => f.id === h.home_flat_id)?.building === 'Haus A')
    expect(hausA).toHaveLength(5)
    for (const h of hausA) expect(assignmentOf(result, h.id)?.status).toBe('ok')
    expect(doubleBookings(result)).toEqual([])
  })

  it('reports Brunner as the only conflict', () => {
    expect(result.conflicts).toHaveLength(1)
    expect(result.conflicts[0]).toMatchObject({ household_id: demoIds.brunner, reason: brunnerReason })
    expect(assignmentOf(result, demoIds.brunner)).toMatchObject({ status: 'conflict', conflict_reason: brunnerReason })
    expect(result.assignments.filter((a) => a.status === 'ok')).toHaveLength(10)
  })

  it('resolves the conflict when phase 3 is shifted by two weeks but not by one', () => {
    const shifted = solve(shiftPhase3(14))
    const brunner = assignmentOf(shifted, demoIds.brunner)
    const tempFlat = demoFlats.find((f) => f.id === brunner?.temp_flat_id)
    expect(shifted.conflicts).toEqual([])
    expect(brunner?.temp_flat_id).toBe(demoIds.flatD01)
    expect(tempFlat?.step_free).toBe(true)
    expect(tempFlat?.rooms).toBeGreaterThanOrEqual(2)
    expect(solve(shiftPhase3(7)).conflicts.map((c) => c.household_id)).toEqual([demoIds.brunner])
  })

  it('is deterministic for shuffled input', () => {
    expect(solve({ phases: [...demoPhases].reverse(), flats: [...demoFlats].reverse(), households: [...demoHouseholds].reverse() })).toEqual(result)
  })

  it('orders the assignments by household name', () => {
    const names = result.assignments.map((a) => demoHouseholds.find((h) => h.id === a.household_id)?.name)
    expect(names).toEqual([
      'Familie Bianchi', 'Familie Kaya', 'Familie Keller', 'Familie Oliveira', 'Familie Steiner', 'Frau Gerber',
      'Frau Meier', 'Frau Schmid', 'Herr Brunner', 'Herr und Frau Aeschbacher', 'Herr Zimmermann',
    ])
  })
})
