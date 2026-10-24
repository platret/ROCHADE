import { fetchProjectData, fetchProjects, subscribeToProject, type Assignment, type ProjectData, type RochadeClient } from '@rochade/shared'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import { connectionReport, isConnectionFailure, loadErrorMessage, serverLine, withTimeout } from '@/lib/connectivity'
import { supabase } from '@/lib/supabase'
import { diffAssignments, type AssignmentChange } from './assignmentChanges'
import type { ProjectContextValue, ProjectState } from './projectTypes'
import { retryWithBackoff } from './retry'
import { readSnapshot, writeSnapshot } from './snapshotCache'

type Snapshot = { data: ProjectData; updatedAt: Date; stale: boolean }
type Baseline = { projectId: string; assignments: Assignment[]; live: boolean }
type LoadMode = 'initial' | 'refresh' | 'silent'

const realtimeDebounceMs = 300
const loadTimeoutMs = 10_000
const refreshTimeoutMs = 6_000

const timeoutFor = (mode: LoadMode) => (mode === 'refresh' ? refreshTimeoutMs : loadTimeoutMs)

const loadProject = async (client: RochadeClient, knownId: string | null) => {
  const id = knownId ?? (await fetchProjects(client))[0]?.id
  if (!id) throw new Error('Kein Projekt gefunden.')
  return { id, data: await fetchProjectData(client, id) }
}

const withoutHousehold = (changes: AssignmentChange[], householdId?: string) =>
  householdId === undefined ? [] : changes.filter((change) => change.householdId !== householdId)

export const useProjectLoader = (): ProjectContextValue => {
  const [cached] = useState(readSnapshot)
  const [snapshot, setSnapshot] = useState<Snapshot | null>(cached && { data: cached.data, updatedAt: cached.updatedAt, stale: true })
  const [error, setError] = useState<string | null>(null)
  const [diagnostics, setDiagnostics] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [projectId, setProjectId] = useState(cached?.projectId ?? null)
  const [changes, setChanges] = useState<AssignmentChange[]>([])
  const [lastChangeAt, setLastChangeAt] = useState<Date | null>(null)
  const requestCounter = useRef(0)
  const mounted = useRef(false)
  const knownProjectId = useRef<string | null>(null)
  const baseline = useRef<Baseline | null>(cached && { projectId: cached.projectId, assignments: cached.data.assignments, live: false })

  const apply = useCallback((id: string, data: ProjectData) => {
    const now = new Date()
    const previous = baseline.current
    const detected = previous?.projectId === id ? diffAssignments(previous.assignments, data.assignments, now) : []
    if (detected.length > 0) {
      setChanges((current) => [...detected, ...current])
      if (previous?.live) setLastChangeAt(now)
    }
    baseline.current = { projectId: id, assignments: data.assignments, live: true }
    knownProjectId.current = id
    setProjectId(id)
    setSnapshot({ data, updatedAt: now, stale: false })
    setError(null)
    writeSnapshot({ projectId: id, data, updatedAt: now })
  }, [])

  const showError = useCallback((caught: unknown) => {
    setError(loadErrorMessage(caught))
    setDiagnostics(serverLine)
  }, [])

  const load = useCallback(async (mode: LoadMode) => {
    const client = supabase
    if (!client) return
    requestCounter.current += 1
    const requestId = requestCounter.current
    const isCurrent = () => mounted.current && requestId === requestCounter.current
    if (mode === 'initial') setError(null)
    if (mode === 'refresh') setRefreshing(true)
    const attempt = () => withTimeout(loadProject(client, knownProjectId.current), timeoutFor(mode))
    const surfaceAndRetry = (caught: unknown) => {
      showError(caught)
      return isConnectionFailure(caught)
    }
    try {
      const { id, data } = await (mode === 'refresh' ? attempt() : retryWithBackoff(attempt, isCurrent, surfaceAndRetry))
      if (isCurrent()) apply(id, data)
    } catch (caught) {
      if (!isCurrent()) return
      showError(caught)
      void connectionReport().then((report) => {
        if (isCurrent()) setDiagnostics(report)
      })
    } finally {
      if (isCurrent()) setRefreshing(false)
    }
  }, [apply, showError])

  useEffect(() => {
    mounted.current = true
    void load('initial')
    const foreground = AppState.addEventListener('change', (status) => {
      if (status === 'active') void load('silent')
    })
    return () => {
      mounted.current = false
      foreground.remove()
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
  const reloadSilently = useCallback(() => void load('silent'), [load])

  const dismissChanges = useCallback((householdId?: string) => setChanges((current) => withoutHousehold(current, householdId)), [])

  const state: ProjectState = !supabase
    ? { status: 'unconfigured' }
    : snapshot
      ? { status: 'ready', data: snapshot.data, updatedAt: snapshot.updatedAt, error, stale: snapshot.stale }
      : error !== null
        ? { status: 'error', error, diagnostics }
        : { status: 'loading' }

  return { ...state, refreshing, reload, reloadSilently, changes, lastChangeAt, dismissChanges }
}
