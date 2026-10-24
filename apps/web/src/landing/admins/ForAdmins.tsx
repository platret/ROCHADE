import { ButtonLink } from '../../components/ButtonLink'
import { BenefitList } from '../BenefitList'
import { Container } from '../Container'
import { Reveal } from '../Reveal'
import { SectionHeading } from '../SectionHeading'
import { DashboardMock } from './DashboardMock'

const benefits = [
  'Jede Etappe lässt sich mit einem Klick verschieben, der Solver rechnet sofort nach.',
  'Konflikte werden erklärt: welche Wohnung fehlt, von wann bis wann.',
  'Zuteilungen, Auszug und Rückkehr in einer Tabelle, sortiert nach Etappe.',
  'Verwaltung und Haushalte sehen denselben Stand, live über Supabase.',
]

export const ForAdmins = () => (
  <section id="fuer-verwaltungen" aria-labelledby="admins-title" className="py-24 md:py-32">
    <Container>
      <div className="grid gap-2 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-6">
          <SectionHeading
            id="admins-title"
            eyebrow="Für Verwaltungen"
            title="Der Plan baut sich neu, wenn sich eine Etappe verschiebt."
            lead="Ein Dashboard für die ganze Sanierung: Bauetappen, Rochade-Wohnungen und jeder Haushalt mit Auszug, Rückkehr und Status."
          />
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
          <BenefitList items={benefits} />
          <div className="mt-8">
            <ButtonLink to="/verwaltung" size="lg">
              Dashboard öffnen
            </ButtonLink>
          </div>
        </Reveal>
      </div>
      <Reveal delay={0.15} className="mt-12 md:mt-16">
        <DashboardMock />
      </Reveal>
    </Container>
  </section>
)
