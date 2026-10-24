import { Container } from '../Container'
import { Reveal } from '../Reveal'
import { SectionHeading } from '../SectionHeading'
import { MomentCard } from './MomentCard'

export const MomentSection = () => (
  <section id="moment" aria-labelledby="moment-title" className="py-24 md:py-32">
    <Container>
      <Reveal>
        <SectionHeading
          id="moment-title"
          eyebrow="Der Moment"
          title="Eine Etappe verschiebt sich. Der Plan folgt."
          lead="ROCHADE rechnet den Umzugsplan neu, sobald sich der Bau verschiebt, und sagt jedem Haushalt, was sich ändert."
        />
      </Reveal>
      <Reveal delay={0.1} className="mt-12">
        <MomentCard />
      </Reveal>
    </Container>
  </section>
)
