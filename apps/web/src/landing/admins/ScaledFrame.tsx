import { useEffect, useRef, useState, type ReactNode } from 'react'

type Props = { width: number; maxHeight: number; minScale?: number; children: ReactNode }

export const ScaledFrame = ({ width, maxHeight, minScale = 0.6, children }: Props) => {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ scale: 1, height: maxHeight })

  useEffect(() => {
    const outerNode = outer.current
    const innerNode = inner.current
    if (!outerNode || !innerNode) return
    const update = () => {
      const scale = Math.min(1, Math.max(minScale, outerNode.clientWidth / width))
      setBox({ scale, height: Math.min(innerNode.scrollHeight * scale, maxHeight) })
    }
    const observer = new ResizeObserver(update)
    observer.observe(outerNode)
    observer.observe(innerNode)
    update()
    return () => observer.disconnect()
  }, [width, maxHeight, minScale])

  return (
    <div ref={outer} className="relative w-full min-w-0 overflow-x-auto overflow-y-hidden overscroll-x-contain" style={{ height: box.height }}>
      <div
        ref={inner}
        className="absolute top-0 left-0 overflow-y-auto overscroll-contain"
        style={{ width, height: box.height / box.scale, transform: `scale(${box.scale})`, transformOrigin: 'top left' }}
      >
        {children}
      </div>
    </div>
  )
}
