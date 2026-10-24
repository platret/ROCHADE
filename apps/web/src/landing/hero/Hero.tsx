import { useInView } from 'motion/react'
import { useRef } from 'react'
import { usePageVisible } from '../../hooks/usePageVisible'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useStoredFlag } from '../../hooks/useStoredFlag'
import { Container } from '../Container'
import { HeroCopy } from './HeroCopy'
import { HeroStage } from './HeroStage'
import { usePointerParallax } from './usePointerParallax'

export const Hero = () => {
  const section = useRef<HTMLElement>(null)
  const inView = useInView(section, { amount: 0.1 })
  const visible = usePageVisible()
  const reduced = useReducedMotion()
  const [paused, setPaused] = useStoredFlag('rochade:hero-paused')
  const pointer = usePointerParallax(section)
  const animate = inView && visible && !paused && !reduced
  return (
    <section ref={section} aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-full max-w-6xl -translate-x-1/2 border-x border-line/60 lg:block" />
      <Container className="relative grid items-center gap-12 pt-12 pb-16 lg:min-h-[min(calc(100svh-72px),820px)] lg:grid-cols-12 lg:gap-6 lg:py-20">
        <div className="lg:col-span-6">
          <HeroCopy />
        </div>
        <div className="lg:col-span-6">
          <HeroStage animate={animate} pointer={pointer} paused={paused} showPause={!reduced} onTogglePause={() => setPaused(!paused)} />
        </div>
      </Container>
    </section>
  )
}
