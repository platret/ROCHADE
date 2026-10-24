import { describe, expect, it } from 'vitest'
import { solve } from './solve'
import { assignmentOf, flat, home, household, phase } from './test-builders'

describe('solve rules', () => {
  const renovation = phase('X', '2027-01-01', '2027-03-31')
  const later = phase('Y', '2027-04-01', '2027-06-30')

  it('never books one temp flat twice for overlapping periods', () => {
    const flats = [home('x1', 'X'), home('x2', 'X'), home('y1', 'Y'), flat('t1', 'T')]
    const same = solve({ phases: [renovation], flats, households: [household('h1', 'x1'), household('h2', 'x2')] })
    expect(same.conflicts).toHaveLength(1)
    const handover = solve({ phases: [renovation, phase('Y', '2027-03-31', '2027-06-30')], flats, households: [household('h1', 'x1'), household('h2', 'y1')] })
    expect(handover.conflicts).toHaveLength(1)
    const disjoint = solve({ phases: [renovation, later], flats, households: [household('h1', 'x1'), household('h2', 'y1')] })
    expect(disjoint.assignments.map((a) => [a.status, a.temp_flat_id])).toEqual([['ok', 't1'], ['ok', 't1']])
  })

  it('requires enough rooms and prefers the smallest flat that fits', () => {
    const flats = [home('x1', 'X'), home('y1', 'Y'), flat('small', 'T', { rooms: 2.5 }), flat('fit', 'T', { rooms: 3.5 }), flat('big', 'T', { rooms: 4.5 })]
    const households = [household('h1', 'x1', { needs_rooms: 3.5 }), household('h2', 'y1', { needs_rooms: 4.5 })]
    const result = solve({ phases: [renovation, later], flats, households })
    expect(result.assignments.map((a) => a.temp_flat_id)).toEqual(['fit', 'big'])
    const tooSmall = solve({ phases: [renovation], flats: flats.filter((f) => f.id !== 'big'), households: [household('h2', 'x1', { needs_rooms: 4.5 })] })
    expect(tooSmall.conflicts.map((c) => c.reason)).toEqual(['Für h2 fehlt vom 01.01.2027 bis 31.03.2027 eine 4.5-Zimmer-Wohnung.'])
  })

  it('never offers a household its own home flat', () => {
    const flats = [flat('x1', 'X', { school_district: 'Waidberg' }), flat('t1', 'T')]
    const result = solve({ phases: [renovation], flats, households: [household('h1', 'x1', { school_district: 'Waidberg' })] })
    expect(assignmentOf(result, 'h1')).toMatchObject({ status: 'ok', temp_flat_id: 't1' })
  })

  it('only offers step-free flats to households that need them', () => {
    const result = solve({ phases: [renovation], flats: [home('x1', 'X'), flat('t1', 'T'), flat('t2', 'T')], households: [household('h1', 'x1', { needs_step_free: true })] })
    expect(result.conflicts).toHaveLength(1)
    expect(result.conflicts[0]?.reason).toContain('hindernisfreie')
  })

  it('leaves out the household that moves out later', () => {
    const flats = [home('x1', 'X'), home('y1', 'Y'), flat('t1', 'T')]
    const result = solve({ phases: [renovation, phase('Y', '2027-02-01', '2027-06-30')], flats, households: [household('late', 'y1'), household('early', 'x1')] })
    expect(assignmentOf(result, 'early')?.status).toBe('ok')
    expect(assignmentOf(result, 'late')?.status).toBe('conflict')
  })

  it('uses the earliest phase when several cover the same building', () => {
    const second = { ...phase('X', '2027-05-01', '2027-06-30'), id: 'phase-X-later' }
    const result = solve({ phases: [second, renovation], flats: [home('x1', 'X'), flat('t1', 'T')], households: [household('h1', 'x1')] })
    expect(assignmentOf(result, 'h1')).toMatchObject({ status: 'ok', move_out: '2027-01-01', move_back: '2027-03-31' })
  })

  it('marks households without a renovation period as open', () => {
    const flats = [home('x1', 'X'), home('z1', 'Z'), flat('t1', 'T')]
    const result = solve({ phases: [renovation], flats, households: [household('h1', 'x1'), household('no-phase', 'z1'), household('no-home', null)] })
    const open = { temp_flat_id: null, move_out: null, move_back: null, status: 'open', conflict_reason: null }
    for (const id of ['no-phase', 'no-home']) expect(assignmentOf(result, id)).toEqual({ household_id: id, ...open })
    expect(result.conflicts).toEqual([])
  })

  it('does not use a temp flat while its own building is renovated', () => {
    const phases = [phase('R', '2027-01-01', '2027-03-31'), phase('X', '2027-02-01', '2027-02-28'), phase('Y', '2027-05-01', '2027-05-31')]
    const result = solve({ phases, flats: [home('x1', 'X'), home('y1', 'Y'), flat('t1', 'R')], households: [household('hx', 'x1'), household('hy', 'y1')] })
    expect(assignmentOf(result, 'hx')?.status).toBe('conflict')
    expect(assignmentOf(result, 'hy')).toMatchObject({ status: 'ok', temp_flat_id: 't1' })
  })

  it('prefers the school district and spares step-free flats', () => {
    const flats = [home('x1', 'X'), home('x2', 'X'), flat('plain', 'T'), flat('near-school', 'T', { school_district: 'Waidberg' }), flat('step-free', 'T', { step_free: true })]
    const result = solve({ phases: [renovation], flats, households: [household('family', 'x1', { school_district: 'Waidberg' }), household('single', 'x2')] })
    expect(assignmentOf(result, 'family')?.temp_flat_id).toBe('near-school')
    expect(assignmentOf(result, 'single')?.temp_flat_id).toBe('plain')
  })
})
