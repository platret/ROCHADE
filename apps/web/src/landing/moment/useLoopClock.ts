import { useEffect, useRef, useState } from 'react'

export const useLoopClock = <T>(loopMs: number, running: boolean, beatAt: (elapsed: number) => T, initial: T) => {
  const [beat, setBeat] = useState(initial)
  const elapsed = useRef(0)

  useEffect(() => {
    if (!running) return
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      elapsed.current = (elapsed.current + now - last) % loopMs
      last = now
      setBeat(beatAt(elapsed.current))
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [loopMs, running, beatAt])

  return beat
}
