import { conflictWord } from '../../lib/labels'
import type { PlanStats } from '../lib/stats'
import { StatChip } from './StatChip'

type Source = 'live' | 'demo'
type Props = { stats: PlanStats | null; source?: Source }

const sourceLabels: Record<Source, string> = { live: 'Live-Daten', demo: 'Beispielprojekt' }

export const StatRow = ({ stats, source }: Props) => {
  const conflicts = stats?.conflicts
  return (
    <div role="group" aria-label="Kennzahlen des Projekts" className="flex flex-wrap items-center gap-2">
      <StatChip value={stats?.households} label="Haushalte" />
      <StatChip value={stats?.rochadeFlats} label="Rochade-Wohnungen" />
      <StatChip value={conflicts} label={conflictWord(conflicts ?? 0)} dot={conflicts === undefined ? undefined : conflicts > 0 ? 'danger' : 'success'} />
      {source && <span className="text-label text-ink-muted">{sourceLabels[source]}</span>}
    </div>
  )
}
