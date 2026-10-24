import type { ISODate, Phase } from '@rochade/shared'
import { useIdentity } from '@/data/IdentityProvider'
import { useMyHousehold } from '@/data/selectors'
import { EtappeCard } from './EtappeCard'
import { moveFacts, nextPhase } from './etappeFocus'

export type EtappeHighlightProps = { phases: Phase[]; today: ISODate }

export const EtappeHighlight = ({ phases, today }: EtappeHighlightProps) => {
  const { identity } = useIdentity()
  const mine = useMyHousehold()
  if (identity?.kind === 'verwaltung') {
    const next = nextPhase(phases, today)
    return next ? <EtappeCard label="Nächste Etappe" phase={next} today={today} /> : null
  }
  if (!mine?.phase) return null
  return <EtappeCard label="Deine Etappe" phase={mine.phase} today={today} moves={moveFacts(mine.assignment, today)} />
}
