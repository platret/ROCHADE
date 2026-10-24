import { CodeXml, Globe, Radio, Trophy, type LucideIcon } from 'lucide-react'
import { githubUrl } from '../lib/labels'
import { Container } from './Container'
import { Reveal } from './Reveal'

type Fact = { icon: LucideIcon; value: string; label: string; href?: string }

const facts: Fact[] = [
  { icon: Trophy, value: 'ZentralHack 2026', label: 'EntrepreneurSkills Challenge' },
  { icon: Globe, value: 'SDG 11 · Nachhaltige Städte', label: 'Bezahlbaren Wohnraum erhalten' },
  { icon: CodeXml, value: 'Open Source auf GitHub', label: 'Quellcode öffentlich einsehbar', href: githubUrl },
  { icon: Radio, value: 'Supabase Realtime', label: 'Jede Änderung in unter einer Sekunde' },
]

export const FactsRow = () => (
  <section id="fakten" aria-label="Fakten zum Projekt" className="py-8">
    <Container>
      <Reveal>
        <ul className="grid gap-6 border-y border-line py-8 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map(({ icon: Icon, value, label, href }) => (
            <li key={value} className="flex gap-3">
              <Icon size={20} className="mt-0.5 shrink-0 text-ink-muted" aria-hidden="true" />
              <div>
                {href ? (
                  <a href={href} target="_blank" rel="noreferrer" className="rounded-sm text-h3 underline-offset-4 hover:underline">
                    {value}
                  </a>
                ) : (
                  <p className="text-h3">{value}</p>
                )}
                <p className="text-body-sm text-ink-muted">{label}</p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </Container>
  </section>
)
