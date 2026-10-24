import { BenefitList } from '../BenefitList'
import { Container } from '../Container'
import { Reveal } from '../Reveal'
import { SectionHeading } from '../SectionHeading'
import { PhoneFrame } from './PhoneFrame'

const benefits = [
  'Live-Update in unter einer Sekunde, mit Banner und altem Datum zum Vergleich.',
  'Ein Konflikt wird erklärt, nicht rot gemalt: der genaue Grund in einem Satz.',
  'Wünsche selbst erfassen: Zimmer, Hindernisfreiheit, Schulkreis, Notiz.',
  'Die ganze Siedlung als Zeitstrahl: wer wann wohin zieht.',
]

const umzugAlt = 'Screenshot der ROCHADE-App, Tab Mein Umzug: Status Zugeteilt, Auszug am 01.03.2027 in Whg. E.21, Rückkehr am 31.05.2027.'
const siedlungAlt = 'Screenshot der ROCHADE-App, Tab Siedlung: Umzugsplan 2027 mit elf Haushalten als Zeitstrahl von März bis Dezember.'

export const ForResidents = () => (
  <section id="fuer-bewohnende" aria-labelledby="residents-title" className="overflow-x-clip py-24 md:py-32">
    <Container className="grid gap-12 lg:grid-cols-12 lg:items-center">
      <Reveal className="lg:col-span-6 lg:col-start-7">
        <SectionHeading
          id="residents-title"
          eyebrow="Für Bewohnende"
          title="Mein Umzug: ein Datum, eine Wohnung und ein Satz, wenn sich etwas ändert."
          lead="Die App zeigt jedem Haushalt nur, was ihn betrifft: Auszug, Rochade-Wohnung, Rückkehr. Gross geschrieben, nichts unter 13 Punkt."
        />
        <BenefitList items={benefits} />
        <p className="mt-6 text-label text-ink-muted">Läuft in Expo Go auf dem iPhone, iOS 16.4 oder neuer.</p>
      </Reveal>
      <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-1 lg:row-start-1">
        <figure className="relative mx-auto w-[256px] py-6 sm:w-[296px]">
          <PhoneFrame
            src="/app-siedlung.png"
            darkSrc="/app-siedlung-dark.png"
            alt={siedlungAlt}
            className="absolute top-16 -left-24 hidden w-[224px] -rotate-6 opacity-80 sm:block"
          />
          <PhoneFrame src="/app-mein-umzug.png" darkSrc="/app-mein-umzug-dark.png" alt={umzugAlt} className="relative" />
          <figcaption className="mt-4 text-center text-label text-ink-muted">Echte Screenshots aus Expo Go.</figcaption>
        </figure>
      </Reveal>
    </Container>
  </section>
)
