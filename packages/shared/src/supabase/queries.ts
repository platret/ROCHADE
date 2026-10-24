import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { addDays } from '../format/date'
import type { Assignment, Flat, Household, Phase, Project, UUID } from '../types'
import type { RochadeClient } from './client'

type QueryResult<T> = { data: T; error: null } | { data: null; error: { message: string } }

export const unwrap = <T>(result: QueryResult<T>): T => {
  if (result.error) throw new Error(result.error.message)
  return result.data
}

export type ProjectData = {
  project: Project
  phases: Phase[]
  flats: Flat[]
  households: Household[]
  assignments: Assignment[]
}

export const fetchProjects = async (client: RochadeClient) =>
  unwrap(await client.from('projects').select('*').order('created_at'))

export const fetchProject = async (client: RochadeClient, projectId: UUID) => {
  const query = client.from('projects').select('*').eq('id', projectId).single()
  return unwrap(await query)
}

export const fetchPhases = async (client: RochadeClient, projectId: UUID) =>
  unwrap(await client.from('phases').select('*').eq('project_id', projectId).order('sort_order').order('start_date'))

export const fetchFlats = async (client: RochadeClient, projectId: UUID) =>
  unwrap(await client.from('flats').select('*').eq('project_id', projectId).order('building').order('label'))

export const fetchHouseholds = async (client: RochadeClient, projectId: UUID) =>
  unwrap(await client.from('households').select('*').eq('project_id', projectId).order('name'))

export const fetchAssignments = async (client: RochadeClient, projectId: UUID) =>
  unwrap(await client.from('assignments').select('*').eq('project_id', projectId))

export const fetchProjectData = async (client: RochadeClient, projectId: UUID): Promise<ProjectData> => {
  const [project, phases, flats, households, assignments] = await Promise.all([
    fetchProject(client, projectId),
    fetchPhases(client, projectId),
    fetchFlats(client, projectId),
    fetchHouseholds(client, projectId),
    fetchAssignments(client, projectId),
  ])
  return { project, phases, flats, households, assignments }
}

const normaliseCode = (code: string) => code.trim().toUpperCase()

export const fetchHouseholdByInviteCode = async (client: RochadeClient, code: string): Promise<Household | null> => {
  const query = client.from('households').select('*').eq('invite_code', normaliseCode(code)).maybeSingle()
  return unwrap(await query)
}

export const fetchProjectByAdminCode = async (client: RochadeClient, code: string): Promise<Project | null> => {
  const query = client.from('projects').select('*').eq('admin_code', normaliseCode(code)).maybeSingle()
  return unwrap(await query)
}

export type HouseholdNeeds = Pick<Household, 'needs_rooms' | 'needs_step_free' | 'school_district' | 'note'>

export const updateHouseholdNeeds = async (client: RochadeClient, householdId: UUID, needs: HouseholdNeeds) => {
  const query = client.from('households').update(needs).eq('id', householdId).select('*').single()
  return unwrap(await query)
}

export const shiftPhase = async (client: RochadeClient, phase: Phase, days: number) => {
  const dates = { start_date: addDays(phase.start_date, days), end_date: addDays(phase.end_date, days) }
  const query = client.from('phases').update(dates).eq('id', phase.id).select('*').single()
  return unwrap(await query)
}

export const liveTables = ['phases', 'households', 'assignments'] as const
export type LiveTable = (typeof liveTables)[number]
export type LiveChange = RealtimePostgresChangesPayload<Record<string, unknown>>

export const subscribeToProject = (
  client: RochadeClient,
  projectId: UUID,
  onChange: (table: LiveTable, change: LiveChange) => void,
) => {
  const channel = client.channel(`project-${projectId}`)
  for (const table of liveTables) {
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table, filter: `project_id=eq.${projectId}` },
      (change) => onChange(table, change),
    )
  }
  channel.subscribe()
  return () => {
    void client.removeChannel(channel)
  }
}
