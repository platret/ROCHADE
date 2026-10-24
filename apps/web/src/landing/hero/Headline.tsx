import { tagline } from '@rochade/shared'
import { Fragment } from 'react'
import { Reveal } from '../Reveal'

const words = tagline.split(' ')
const breakAfter = new Set([0, 2])

export const Headline = () => (
  <h1
    id="hero-title"
    className="mt-4 text-[clamp(40px,10vw,48px)] leading-[1.08] font-extrabold tracking-[-0.02em] text-ink hyphens-manual lg:text-[clamp(48px,4.5vw,64px)] lg:leading-[1.06]"
  >
    {words.map((word, index) => (
      <Fragment key={word}>
        <Reveal as="span" onMount delay={0.06 + index * 0.07} className="inline-block">
          {word}
        </Reveal>
        {' '}
        {breakAfter.has(index) && <br className="hidden md:block" />}
      </Fragment>
    ))}
  </h1>
)
