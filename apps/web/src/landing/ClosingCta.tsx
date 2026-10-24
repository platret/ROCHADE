import { demoProject } from '@rochade/shared'
import { ArrowUpRight } from 'lucide-react'
import { ButtonLink } from '../components/ButtonLink'
import { githubUrl } from '../lib/labels'
import { Container } from './Container'
import { demoStats } from './lib/stats'
import { Reveal } from './Reveal'

const lead = `Demo mit ${demoProject.name}: 3 Etappen, ${demoStats.households} Haushalte, ${demoStats.rochadeFlats} Rochade-Wohnungen und ein Konflikt, der sich lösen lässt.`

export const ClosingCta = () => (
  <section aria-labelledby="cta-title" className="py-24 md:py-32">
    <Container>
      <Reveal>
        <div className="rounded-lg bg-surface-sunken px-6 py-12 text-center lg:px-12 lg:py-16">
          <h2 id="cta-title" className="mx-auto max-w-2xl text-h1 text-balance lg:text-display">
            Bereit für die nächste Sanierung?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-body text-pretty text-ink-muted">{lead}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink to="/verwaltung" size="lg">
              Verwaltung öffnen
            </ButtonLink>
            <ButtonLink to={githubUrl} variant="secondary" size="lg" target="_blank" rel="noreferrer">
              Quellcode ansehen
              <ArrowUpRight size={18} aria-hidden="true" />
            </ButtonLink>
          </div>
          <p className="mt-4 text-label text-ink-muted">Kein Login. Die Demo-Daten liegen in einer Supabase-Datenbank.</p>
        </div>
      </Reveal>
    </Container>
  </section>
)
