import { wordmark } from '@rochade/shared'
import { Link } from 'react-router'
import { ButtonLink } from '../components/ButtonLink'
import { LogoMark } from '../components/LogoMark'
import { useScrolled } from '../hooks/useScrolled'
import { cx } from '../lib/cx'
import { Container } from './Container'
import { navLinks } from './navLinks'

export const Nav = () => {
  const scrolled = useScrolled()
  return (
    <header
      className={cx(
        'sticky top-0 z-40 bg-paper/80 backdrop-blur-md transition-shadow duration-200',
        scrolled && 'shadow-[0_1px_0_0_var(--line)]',
      )}
    >
      <Container className="flex h-18 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 rounded-sm" aria-label="ROCHADE Startseite">
          <LogoMark size={28} />
          <span className="text-h3 font-extrabold tracking-wordmark">{wordmark.text}</span>
        </Link>
        <nav aria-label="Hauptnavigation" className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="rounded-sm text-body-sm font-semibold text-ink-muted hover:text-ink">
              {link.label}
            </a>
          ))}
        </nav>
        <ButtonLink to="/verwaltung" variant="secondary" className="text-body-sm max-sm:hidden">
          Verwaltung öffnen
        </ButtonLink>
      </Container>
    </header>
  )
}
