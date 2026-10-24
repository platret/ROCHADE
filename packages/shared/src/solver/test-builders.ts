import type { Flat, Household, Phase } from '../types'
import type { SolveResult } from './types'

const common = { project_id: 'p1', created_at: '2026-01-01T00:00:00+00:00' }

export const phase = (building: string, start_date: string, end_date: string): Phase =>
  ({ ...common, id: `phase-${building}`, name: building, building, start_date, end_date, sort_order: 0 })

export const flat = (id: string, building: string, overrides: Partial<Flat> = {}): Flat =>
  ({ ...common, id, label: id, building, floor: 0, rooms: 3, step_free: false, is_temporary: true, school_district: null, ...overrides })

export const home = (id: string, building: string) => flat(id, building, { is_temporary: false })

export const household = (id: string, home_flat_id: string | null, overrides: Partial<Household> = {}): Household =>
  ({ ...common, id, name: id, members: 1, home_flat_id, needs_rooms: 2, needs_step_free: false, school_district: null, note: null, ...overrides })

export const assignmentOf = ({ assignments }: SolveResult, householdId: string) =>
  assignments.find((assignment) => assignment.household_id === householdId)
