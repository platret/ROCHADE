import { MotionConfig } from 'motion/react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { ForAdmins } from './admins/ForAdmins'
import { ClosingCta } from './ClosingCta'
import { FactsRow } from './FactsRow'
import { Hero } from './hero/Hero'
import { HowItWorks } from './HowItWorks'
import { LandingFooter } from './LandingFooter'
import { MomentSection } from './moment/MomentSection'
import { Nav } from './Nav'
import { ForResidents } from './residents/ForResidents'

export const LandingPage = () => {
  useDocumentTitle('ROCHADE – Sanieren, ohne jemanden rauszuwerfen.')
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#inhalt"
        className="sr-only rounded-md bg-surface px-3 py-2 text-label text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
      >
        Zum Inhalt springen
      </a>
      <Nav />
      <main id="inhalt">
        <Hero />
        <MomentSection />
        <HowItWorks />
        <ForAdmins />
        <ForResidents />
        <FactsRow />
        <ClosingCta />
      </main>
      <LandingFooter />
    </MotionConfig>
  )
}
