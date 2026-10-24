import { describe, expect, it } from 'vitest'
import { demoFlats, demoHouseholds, demoIds, demoPhases, demoProject } from '../demo/seed-data'
import { solve } from '../solver/solve'
import type { Assignment } from '../types'
import type { RochadeClient } from './client'
import { replan } from './replan'

type Row = Record<string, unknown>
type FakeResult = { data: Row | null; error: { message: string } | null }
type FakeQuery = { data: Row[]; error: null; eq: () => FakeQuery; order: () => FakeQuery; single: () => FakeResult }

const plan = solve({ phases: demoPhases, flats: demoFlats, households: demoHouseholds })
const stamp = '2026-01-01T00:00:00+00:00'
const stored: Assignment[] = plan.assignments.map((assignment, index) => ({
  ...assignment,
  id: `assignment-${index + 1}`,
  project_id: demoProject.id,
  created_at: stamp,
  updated_at: stamp,
}))
const tables = { projects: [demoProject], phases: demoPhases, flats: demoFlats, households: demoHouseholds, assignments: stored }

const query = (rows: Row[]): FakeQuery => ({
  data: rows,
  error: null,
  eq: () => query(rows),
  order: () => query(rows),
  single: () => (rows[0] ? { data: rows[0], error: null } : { data: null, error: { message: 'Projekt nicht gefunden' } }),
})

const fakeClient = (data: Record<string, Row[]>, upserted: Row[][]) => {
  const from = (table: string) => ({
    select: () => query(data[table] ?? []),
    upsert: (rows: Row[]) => {
      upserted.push(rows)
      return { data: null, error: null }
    },
  })
  return { from } as unknown as RochadeClient
}

describe('replan', () => {
  it('upserts only the rows that differ from the stored plan', async () => {
    const stale = stored.map((row) => (row.household_id === demoIds.meier ? { ...row, temp_flat_id: null, status: 'conflict' as const } : row))
    const existing = stale.filter((row) => row.household_id !== demoIds.keller)
    const upserted: Row[][] = []
    const { result, changed } = await replan(fakeClient({ ...tables, assignments: existing }, upserted), demoProject.id)
    const rows = upserted[0] ?? []
    expect(result).toEqual(plan)
    expect(changed).toBe(2)
    expect(upserted).toHaveLength(1)
    expect(rows.map((row) => row.household_id)).toEqual([demoIds.keller, demoIds.meier])
    for (const row of rows) expect(row).toMatchObject({ project_id: demoProject.id, updated_at: expect.any(String) })
  })

  it('writes nothing when the stored plan is current', async () => {
    const upserted: Row[][] = []
    const { changed } = await replan(fakeClient(tables, upserted), demoProject.id)
    expect(changed).toBe(0)
    expect(upserted).toEqual([])
  })

  it('fails for an unknown project instead of planning nothing', async () => {
    await expect(replan(fakeClient({ ...tables, projects: [] }, []), 'unbekannt')).rejects.toThrow('Projekt nicht gefunden')
  })
})
