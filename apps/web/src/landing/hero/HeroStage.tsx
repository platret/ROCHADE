import { lazy, Suspense, useState } from 'react'
import { cx } from '../../lib/cx'
import { HeroPoster } from './HeroPoster'
import { useDeferredMount } from './useDeferredMount'
import type { PointerRef } from './usePointerParallax'

const HeroScene = lazy(() => import('./HeroScene'))

type Props = { animate: boolean; pointer: PointerRef; paused: boolean; showPause: boolean; onTogglePause: () => void }

export const HeroStage = ({ animate, pointer, paused, showPause, onTogglePause }: Props) => {
  const mounted = useDeferredMount()
  const [ready, setReady] = useState(false)
  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-lg sm:h-[380px] lg:h-[560px] xl:h-[620px]">
      <HeroPoster faded={ready} />
      {mounted && (
        <div
          aria-hidden="true"
          className={cx('absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-out-soft', ready ? 'scale-100 opacity-100' : 'scale-[0.96] opacity-0')}
        >
          <Suspense fallback={null}>
            <HeroScene animate={animate} pointer={pointer} onReady={() => setReady(true)} />
          </Suspense>
        </div>
      )}
      {showPause && ready && (
        <button
          type="button"
          onClick={onTogglePause}
          aria-pressed={paused}
          className="absolute right-3 bottom-3 rounded-sm px-2 py-1 text-label text-ink-muted hover:bg-surface-sunken hover:text-ink"
        >
          {paused ? 'Animation fortsetzen' : 'Animation anhalten'}
        </button>
      )}
    </div>
  )
}
