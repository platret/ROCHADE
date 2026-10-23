import { formatPeriod, periodLengthDays, type Phase } from '@rochade/shared'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'
import { Card } from './Card'

type Props = { phase: Phase; disabled: boolean; onShift: (phase: Phase, days: number) => void }

const weekDays = 7

export const PhaseCard = ({ phase, disabled, onShift }: Props) => {
  const period = { start: phase.start_date, end: phase.end_date }
  return (
    <Card className="space-y-4">
      <div>
        <h3 className="text-h3">{phase.name}</h3>
        <p className="text-body-sm text-ink-muted">{phase.building}</p>
      </div>
      <div>
        <p className="font-mono text-body-sm">{formatPeriod(period)}</p>
        <p className="text-caption text-ink-muted">{periodLengthDays(period)} Tage</p>
      </div>
      <div className="flex gap-2" role="group" aria-label={`${phase.name} verschieben`}>
        <Button disabled={disabled} onClick={() => onShift(phase, -weekDays)}>
          <ChevronLeft size={16} />
          −1 Woche
        </Button>
        <Button disabled={disabled} onClick={() => onShift(phase, weekDays)}>
          <ChevronRight size={16} />
          +1 Woche
        </Button>
      </div>
    </Card>
  )
}
