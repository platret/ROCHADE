import { useEffect, useRef, useState } from 'react'
import { useWindowDimensions, type ViewInstance } from 'react-native'
import { useScrollSubscribe } from './scrollEvents'

const peek = 160

export const useOnScreen = (enabled: boolean) => {
  const subscribe = useScrollSubscribe()
  const { height } = useWindowDimensions()
  const ref = useRef<ViewInstance>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled || visible) return
    const check = () =>
      ref.current?.measureInWindow((_x, y, _width, measuredHeight) => {
        if (y + Math.min(peek, measuredHeight) <= height && y + measuredHeight > 0) setVisible(true)
      })
    check()
    return subscribe(check)
  }, [enabled, height, subscribe, visible])

  return { ref, visible }
}
