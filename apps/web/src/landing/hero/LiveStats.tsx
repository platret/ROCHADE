import { demoStats } from '../lib/stats'
import { useProjectStats } from '../lib/useProjectStats'
import { StatRow } from './StatRow'

export const LiveStats = () => {
  const state = useProjectStats()
  if (state.status === 'loading') return <StatRow stats={null} />
  if (state.status === 'demo') return <StatRow stats={demoStats} source="demo" />
  return <StatRow stats={state.stats} source="live" />
}
