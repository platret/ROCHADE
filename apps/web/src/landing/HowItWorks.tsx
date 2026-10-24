import { BellRing, ClipboardList, Workflow, type LucideIcon } from 'lucide-react'
import { Container } from './Container'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

type Step = { icon: LucideIcon; title: string; text: string; meta: string }

const steps: Step[] = [
  {
    icon: ClipboardList,
    title: 'Bedürfnisse erfassen',
    text: 'Haushalte tragen Zimmer, Hindernisfreiheit und Schulkreis in der App ein. Die Verwaltung sieht alles auf einen Blick.',
    meta: 'In der App, 2 Minuten',
  },
  {
    icon: Workflow,
    title: 'Plan berechnen',
    text: 'Der Solver ordnet jedem Haushalt eine Rochade-Wohnung zu, Etappe für Etappe, und nennt genau, was fehlt.',
    meta: 'Unter 1 Sekunde, nachvollziehbar',
  },
  {
    icon: BellRing,
    title: 'Live informieren',
    text: 'Verschiebt sich eine Etappe, wird der Plan neu gerechnet und jeder Betroffene sieht sofort, was sich ändert.',
    meta: 'Push an alle Betroffenen',
  },
]

export const HowItWorks = () => (
  <section id="so-funktioniert-es" aria-labelledby="how-title" className="py-24 md:py-32">
    <Container>
      <Reveal>
        <SectionHeading
          id="how-title"
          eyebrow="So funktioniert es"
          title="Drei Schritte, ein Plan, der mitdenkt."
          lead="Vom ersten Wunsch bis zur Push-Nachricht: ROCHADE hält alle auf dem gleichen Stand, ohne Excel und ohne Telefonkette."
        />
      </Reveal>
      <ol className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, text, meta }, index) => (
          <Reveal key={title} as="li" delay={index * 0.08} className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-6">
            <div className="flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-md bg-surface-sunken text-ink">
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className="text-label text-ink-muted">Schritt {index + 1}</span>
            </div>
            <h3 className="text-h3">{title}</h3>
            <p className="text-body text-ink-muted">{text}</p>
            <p className="mt-auto text-label text-ink-muted">{meta}</p>
          </Reveal>
        ))}
      </ol>
    </Container>
  </section>
)
