import { fetchProjectData, fetchProjects, type RochadeClient } from '@rochade/shared'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { planStats, type PlanStats } from './stats'

export type StatsState = { status: 'loading' } | { status: 'demo' } | { status: 'live'; stats: PlanStats }

const demo: StatsState = { status: 'demo' }

const loadStats = async (client: RochadeClient): Promise<StatsState> => {
  const [project] = await fetchProjects(client)
  if (!project) return demo
  return { status: 'live', stats: planStats(await fetchProjectData(client, project.id)) }
}

export const useProjectStats = () => {
  const [state, setState] = useState<StatsState>(supabase ? { status: 'loading' } : demo)

  useEffect(() => {
    if (!supabase) return
    let active = true
    loadStats(supabase)
      .catch(() => demo)
      .then((next) => active && setState(next))
    return () => {
      active = false
    }
  }, [])

  return state
}
