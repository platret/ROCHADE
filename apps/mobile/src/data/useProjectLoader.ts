import { fetchProjectData, fetchProjects, subscribeToProject, type Assignment, type ProjectData, type RochadeClient } from '@rochade/shared'
import { useCallback, useEffect, useRef, useState } from 'react'
import { connectionReport, withTimeout } from '@/lib/connectivity'
import { messageOf } from '@/lib/errors'
import { supabase, supabaseHost } from '@/lib/supabase'
import { diffAssignments, type AssignmentChange } from './assignmentChanges'
import type { ProjectContextValue, ProjectState } from './projectTypes'

type Snapshot = { data: ProjectData; updatedAt: Date }
type LoadMode = 'initial' | 'refresh' | 'silent'

const realtimeDebounceMs = 300
const loadTimeoutMs = 15_000

const firstProjectId = async (client: RochadeClient) => {
  const [first] = await fetchProjects(client)
  if (!first) throw new Error('Kein Projekt gefunden.')
  return first.id
}

export const useProjectLoader = (): ProjectContextValue => {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [changes, setChanges] = useState<AssignmentChange[]>([])
  const [lastChangeAt, setLastChangeAt] = useState<Date | null>(null)
  const requestCounter = useRef(0)
  const mounted = useRef(false)
  const knownProjectId = useRef<string | null>(null)
  const lastAssignments = useRef<Assignment[] | null>(null)

  const load = useCallback(async (mode: LoadMode) => {
    const client = supabase
    if (!client) return
    requestCounter.current += 1
    const requestId = requestCounter.current
    const isCurrent = () => mounted.current && requestId === requestCounter.current
    if (mode === 'initial') setError(null)
    if (mode === 'refresh') setRefreshing(true)
    try {
      const id = knownProjectId.current ?? (await withTimeout(firstProjectId(client), loadTimeoutMs))
      const data = await withTimeout(fetchProjectData(client, id), loadTimeoutMs)
      if (!isCurrent()) return
      const now = new Date()
      const previous = lastAssignments.current
      const detected = previous ? diffAssignments(previous, data.assignments, now) : []
      if (detected.length > 0) {
        setChanges((current) => [...detected, ...current])
        setLastChangeAt(now)
      }
      lastAssignments.current = data.assignments
      knownProjectId.current = id
      setProjectId(id)
      setSnapshot({ data, updatedAt: now })
      setError(null)
    } catch (caught) {
      if (!isCurrent()) return
      const report = await connectionReport()
      if (isCurrent()) setError(`${messageOf(caught)} (Server: ${supabaseHost})\n${report}`)
    } finally {
      if (isCurrent()) setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    void load('initial')
    return () => {
      mounted.current = false
    }
  }, [load])

  useEffect(() => {
    const client = supabase
    if (!client || !projectId) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const unsubscribe = subscribeToProject(client, projectId, () => {
      clearTimeout(timer)
      timer = setTimeout(() => void load('silent'), realtimeDebounceMs)
    })
    return () => {
      clearTimeout(timer)
      unsubscribe()
    }
  }, [projectId, load])

  const hasSnapshot = snapshot !== null
  const reload = useCallback(() => void load(hasSnapshot ? 'refresh' : 'initial'), [load, hasSnapshot])

  const dismissChanges = useCallback(
    (householdId: string) => setChanges((current) => current.filter((change) => change.householdId !== householdId)),
    [],
  )

  const state: ProjectState = !supabase
    ? { status: 'unconfigured' }
    : snapshot
      ? { status: 'ready', data: snapshot.data, updatedAt: snapshot.updatedAt, error }
      : error !== null
        ? { status: 'error', error }
        : { status: 'loading' }

  return { ...state, refreshing, reload, changes, lastChangeAt, dismissChanges }
}
