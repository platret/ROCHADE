import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'

type Props = { active: boolean; onReady: () => void }

export const FrameDriver = ({ active, onReady }: Props) => {
  const invalidate = useThree((root) => root.invalidate)
  const ready = useRef(false)

  useEffect(() => {
    invalidate()
    if (!active) return
    let frame = 0
    const tick = () => {
      invalidate()
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, invalidate])

  useFrame(() => {
    if (ready.current) return
    ready.current = true
    onReady()
  })

  return null
}
