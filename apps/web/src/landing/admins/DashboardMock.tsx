import { AssignmentSection } from '../../components/AssignmentSection'
import { PhaseSection } from '../../components/PhaseSection'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { ScaledFrame } from './ScaledFrame'
import { useDemoPlan } from './useDemoPlan'

const dots = ['links', 'mitte', 'rechts']
const previewLabel = 'Interaktive Vorschau der Verwaltung mit Demo-Daten'

export const DashboardMock = () => {
  const { data, plan } = useDemoPlan()
  const wide = useMediaQuery('(min-width: 768px)')
  return (
    <figure className="overflow-hidden rounded-lg border border-line bg-surface shadow-mock">
      <div className="flex h-9 items-center gap-3 border-b border-line px-3" aria-hidden="true">
        <span className="flex gap-1.5">
          {dots.map((dot) => (
            <span key={dot} className="size-2.5 rounded-full bg-line" />
          ))}
        </span>
        <span className="mx-auto rounded-sm bg-surface-sunken px-3 py-0.5 font-mono text-label font-medium text-ink-muted">rochade.app/verwaltung</span>
      </div>
      {wide ? (
        <ScaledFrame width={960} minScale={0.85} maxHeight={440}>
          <div className="space-y-8 bg-paper p-6" role="group" aria-label={previewLabel}>
            <PhaseSection phases={data.phases} plan={plan} />
            <AssignmentSection data={data} />
          </div>
        </ScaledFrame>
      ) : (
        <div className="bg-paper p-4" role="group" aria-label={previewLabel}>
          <PhaseSection phases={data.phases} plan={plan} />
        </div>
      )}
      <figcaption className="border-t border-line px-4 py-3 text-label text-ink-muted">
        Probieren: Etappe 3 um zwei Wochen verschieben. Der Plan rechnet lokal neu, nichts wird gespeichert.
      </figcaption>
    </figure>
  )
}
