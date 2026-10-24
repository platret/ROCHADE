import { describe, expect, it } from 'vitest'
import { demoFlats, demoHouseholds, demoPhases } from '../demo/seed-data'
import { search } from './search'
import { solve } from './solve'
import { buildTasks } from './tasks'
import { flat, home, household, phase } from './test-builders'

type WithDistrict = { id: string; school_district: string | null }

const districts = ['d1', 'd2', 'd3', 'd4', 'd5']
const names = 'ABCDEFGHIJKLM'.split('')
const tempFlats = districts.map((district, index) => flat(`F${index + 1}`, 'T', { school_district: district }))
const homes = names.map((name) => home(`x-${name}`, 'X'))
const households = names.map((name, index) =>
  household(name, `x-${name}`, { school_district: index < 2 ? null : (districts[(index - 2) % districts.length] ?? null) }),
)

const districtOf = (rows: WithDistrict[], id: string | null) => rows.find((row) => row.id === id)?.school_district

describe('search', () => {
  it('finds the optimum when more households compete than the temp flats can host', () => {
    const result = solve({ phases: [phase('X', '2027-01-01', '2027-03-31')], flats: [...homes, ...tempFlats], households })
    const placed = result.assignments.filter((assignment) => assignment.status === 'ok')
    const pairs = placed.map((assignment) => [districtOf(households, assignment.household_id), districtOf(tempFlats, assignment.temp_flat_id)])
    expect(result.conflicts).toHaveLength(names.length - districts.length)
    expect(pairs.map(([fromHousehold]) => fromHousehold).sort()).toEqual(districts)
    expect(pairs.every(([fromHousehold, fromFlat]) => fromHousehold === fromFlat)).toBe(true)
  })

  it('returns one slot per household when the node limit cuts the search short', () => {
    const tasks = buildTasks(demoHouseholds, demoFlats, demoPhases)
    const cut = search(tasks, 1)
    expect(cut).toHaveLength(tasks.length)
    expect(cut.every((slot) => slot === null)).toBe(true)
    expect(search(tasks).filter(Boolean)).toHaveLength(10)
  })
})
