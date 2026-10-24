import { useEffect, useRef, type RefObject } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'

export type PointerTarget = { x: number; y: number }
export type PointerRef = RefObject<PointerTarget>

const centre: PointerTarget = { x: 0, y: 0 }

export const usePointerParallax = (ref: RefObject<HTMLElement | null>): PointerRef => {
  const target = useRef<PointerTarget>(centre)
  const hoverable = useMediaQuery('(hover: hover) and (pointer: fine)')

  useEffect(() => {
    const element = ref.current
    if (!element || !hoverable) return
    const move = (event: PointerEvent) => {
      const box = element.getBoundingClientRect()
      target.current = { x: ((event.clientX - box.left) / box.width) * 2 - 1, y: ((event.clientY - box.top) / box.height) * 2 - 1 }
    }
    const leave = () => {
      target.current = centre
    }
    element.addEventListener('pointermove', move, { passive: true })
    element.addEventListener('pointerleave', leave)
    return () => {
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', leave)
    }
  }, [ref, hoverable])

  return target
}
