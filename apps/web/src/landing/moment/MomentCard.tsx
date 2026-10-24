import { demoProject } from '@rochade/shared'
import { useInView } from 'motion/react'
import { useRef, useState } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { usePageVisible } from '../../hooks/usePageVisible'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { beatAt, beatFlags, firstBeat, loopMs, staticFlags } from './beats'
import { Diagram } from './Diagram'
import { MessageLine, MomentCaption } from './MomentCaption'
import { BeforeAfterToggle, PauseButton } from './MomentControls'
import { PushCard } from './PushCard'
import { useLoopClock } from './useLoopClock'

export const MomentCard = () => {
  const card = useRef<HTMLDivElement>(null)
  const inView = useInView(card, { amount: 0.3 })
  const visible = usePageVisible()
  const reduced = useReducedMotion()
  const wide = useMediaQuery('(min-width: 1024px)')
  const [paused, setPaused] = useState(false)
  const [after, setAfter] = useState(true)
  const beat = useLoopClock(loopMs, inView && visible && !paused && !reduced, beatAt, firstBeat)
  const flags = reduced ? staticFlags(after) : beatFlags(beat)
  const phone = wide && flags.push

  return (
    <div>
      <div ref={card} className="overflow-hidden rounded-lg border border-line bg-surface p-4 [contain:layout_paint] md:p-6">
        <div className="flex h-8 items-center justify-between gap-4">
          <p className="text-label text-ink-muted">Umzugsplan · {demoProject.name}</p>
          {reduced ? <BeforeAfterToggle after={after} onChange={setAfter} /> : <PauseButton paused={paused} onToggle={() => setPaused(!paused)} />}
        </div>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_220px]">
          <Diagram flags={flags} />
          <div className="relative">
            {!phone && <MessageLine resolved={flags.resolved} />}
            <PushCard visible={phone} />
          </div>
        </div>
      </div>
      <MomentCaption step={flags.step} />
    </div>
  )
}
