import { solve } from '../solver/solve'
import { demoFlats, demoHouseholds, demoPhases, demoProject } from './seed-data'

type SqlValue = string | number | boolean | null
type SqlRow = Record<string, SqlValue>
type TableSeed = { table: string; columns: string[]; rows: SqlRow[] }

const header = '-- ROCHADE demo data. Run schema.sql first, then this file.'
const assignmentId = (n: number) => `e0000000-0000-4000-8000-${String(n).padStart(12, '0')}`

const literal = (value: SqlValue) => {
  if (value === null) return 'null'
  if (typeof value === 'string') return `'${value.replaceAll("'", "''")}'`
  return String(value)
}

const insert = ({ table, columns, rows }: TableSeed) => {
  const values = rows.map((row) => `  (${columns.map((column) => literal(row[column] ?? null)).join(', ')})`)
  return `insert into public.${table} (${columns.join(', ')}) values\n${values.join(',\n')};`
}

const plannedAssignments = () =>
  solve({ phases: demoPhases, flats: demoFlats, households: demoHouseholds }).assignments.map((assignment, index) => ({
    ...assignment,
    id: assignmentId(index + 1),
    project_id: demoProject.id,
  }))

export const buildSeedSql = () => {
  const seeds: TableSeed[] = [
    { table: 'projects', columns: ['id', 'name', 'city', 'admin_code'], rows: [demoProject] },
    { table: 'phases', columns: ['id', 'project_id', 'name', 'building', 'start_date', 'end_date', 'sort_order'], rows: demoPhases },
    { table: 'flats', columns: ['id', 'project_id', 'label', 'building', 'floor', 'rooms', 'step_free', 'is_temporary', 'school_district'], rows: demoFlats },
    { table: 'households', columns: ['id', 'project_id', 'name', 'members', 'home_flat_id', 'needs_rooms', 'needs_step_free', 'school_district', 'note', 'invite_code'], rows: demoHouseholds },
    { table: 'assignments', columns: ['id', 'project_id', 'household_id', 'temp_flat_id', 'move_out', 'move_back', 'status', 'conflict_reason'], rows: plannedAssignments() },
  ]
  return `${[header, ...seeds.map(insert)].join('\n\n')}\n`
}
