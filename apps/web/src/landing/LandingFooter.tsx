import { demoProject, tagline, wordmark } from '@rochade/shared'
import { Link } from 'react-router'
import { LogoMark } from '../components/LogoMark'
import { githubUrl } from '../lib/labels'
import { Container } from './Container'
import { navLinks } from './navLinks'

const columns = [
  { title: 'Produkt', links: [{ href: '/verwaltung', label: 'Verwaltung' }, { href: '#moment', label: 'Der Moment' }, ...navLinks] },
  {
    title: 'Projekt',
    links: [
      { href: githubUrl, label: 'GitHub' },
      { href: 'https://sdgs.un.org/goals/goal11', label: 'SDG 11' },
      { href: '#fakten', label: 'ZentralHack 2026' },
    ],
  },
]

const linkClass = 'rounded-sm text-body-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline'

const FooterLink = ({ href, label }: { href: string; label: string }) =>
  href.startsWith('/') ? (
    <Link to={href} className={linkClass}>
      {label}
    </Link>
  ) : (
    <a href={href} className={linkClass} {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {label}
    </a>
  )

export const LandingFooter = () => (
  <footer className="border-t border-line pt-12 pb-8">
    <Container className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div className="flex items-center gap-2">
          <LogoMark size={20} tone="ink" />
          <span className="text-body font-extrabold tracking-wordmark">{wordmark.text}</span>
        </div>
        <p className="mt-3 max-w-xs text-body-sm text-ink-muted">{tagline}</p>
        <p className="mt-1 text-body-sm text-ink-muted">Gebaut in Zürich am ZentralHack 2026.</p>
      </div>
      <nav aria-label="Fusszeile" className="grid grid-cols-2 gap-6 lg:col-span-7 lg:col-start-7">
        {columns.map((column) => (
          <div key={column.title}>
            <p className="mb-3 text-label text-ink">{column.title}</p>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <FooterLink {...link} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="flex flex-wrap justify-between gap-2 border-t border-line pt-4 font-mono text-label font-medium text-ink-muted lg:col-span-12">
        <span>
          © 2026 ROCHADE · Demo-Daten: {demoProject.name}, {demoProject.city}
        </span>
        <span>Daten: Supabase · Realtime aktiv</span>
      </div>
    </Container>
  </footer>
)
