import { fetchProjectData, fetchProjects, subscribeToProject, type ProjectData, type RochadeClient, type UUID } from '@rochade/shared'
import { useCallback, useEffect, useState } from 'react'
import { errorMessage } from '../lib/errors'

export type ProjectState =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'ready'; data: ProjectData }

const noProjectMessage = 'Kein Projekt gefunden. Bitte seed.sql ausführen.'
const refetchDelayMs = 150

export const useProjectData = (client: RochadeClient) => {
  const [state, setState] = useState<ProjectState>({ status: 'loading' })
  const [lastChangeAt, setLastChangeAt] = useState<Date | null>(null)
  const [attempt, setAttempt] = useState(0)

  const reload = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((count) => count + 1)
  }, [])

  useEffect(() => {
    let active = true
    let latest = 0
    let unsubscribe = () => {}
    let timer: ReturnType<typeof setTimeout> | undefined

    const fail = (error: unknown) => active && setState({ status: 'error', error: errorMessage(error) })
    const load = (projectId: UUID) => {
      const seq = ++latest
      return fetchProjectData(client, projectId)
        .then((data) => active && seq === latest && setState({ status: 'ready', data }))
        .catch((error: unknown) => seq === latest && fail(error))
    }
    const scheduleLoad = (projectId: UUID) => {
      if (!active) return
      setLastChangeAt(new Date())
      clearTimeout(timer)
      timer = setTimeout(() => void load(projectId), refetchDelayMs)
    }

    fetchProjects(client)
      .then((projects) => {
        const project = projects[0]
        if (!project) throw new Error(noProjectMessage)
        if (!active) return
        unsubscribe = subscribeToProject(client, project.id, () => scheduleLoad(project.id))
        return load(project.id)
      })
      .catch(fail)

    return () => {
      active = false
      clearTimeout(timer)
      unsubscribe()
    }
  }, [client, attempt])

  return { ...state, reload, lastChangeAt }
}
