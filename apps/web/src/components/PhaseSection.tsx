import type { Phase } from '@rochade/shared'
import { RefreshCw } from 'lucide-react'
import type { PlanActions } from '../hooks/usePlan'
import { Button } from './Button'
import { PhaseCard } from './PhaseCard'
import { PlanStatus } from './PlanStatus'
import { Section } from './Section'

type Props = { phases: Phase[]; plan: PlanActions }

export const PhaseSection = ({ phases, plan }: Props) => (
  <Section
    title="Bauetappen"
    aside={
      <Button variant="secondary" disabled={plan.busy} onClick={plan.recalculate}>
        <RefreshCw size={16} />
        Plan neu berechnen
      </Button>
    }
  >
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {phases.map((phase) => (
        <PhaseCard key={phase.id} phase={phase} disabled={plan.busy} onShift={plan.shift} />
      ))}
    </div>
    <PlanStatus busy={plan.busy} toast={plan.toast} error={plan.error} />
  </Section>
)
