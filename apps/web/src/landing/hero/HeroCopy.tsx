import { ArrowDown } from 'lucide-react'
import { ButtonLink } from '../../components/ButtonLink'
import { Reveal } from '../Reveal'
import { Headline } from './Headline'
import { LiveStats } from './LiveStats'

const subline =
  'ROCHADE plant die Rochade-Wohnungen einer Siedlung automatisch, baut den Plan bei jeder Terminänderung neu und sagt genau, was fehlt.'

export const HeroCopy = () => (
  <div className="max-w-[560px]">
    <Reveal onMount>
      <p className="flex items-center gap-2 text-label text-ink-muted">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-ink" />
        ZentralHack 2026 · SDG 11
      </p>
    </Reveal>
    <Headline />
    <Reveal onMount delay={0.3}>
      <p className="mt-6 max-w-[44ch] text-body text-pretty text-ink-muted md:text-[18px] md:leading-7">{subline}</p>
    </Reveal>
    <Reveal onMount delay={0.38}>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink to="/verwaltung" size="lg">
          Demo öffnen
        </ButtonLink>
        <ButtonLink to="#moment" variant="secondary" size="lg">
          Den Moment ansehen
          <ArrowDown size={16} aria-hidden="true" />
        </ButtonLink>
      </div>
    </Reveal>
    <Reveal onMount delay={0.46} className="mt-8">
      <LiveStats />
    </Reveal>
  </div>
)
