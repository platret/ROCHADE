import { useEffect, useState } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type SavingNavigator = Navigator & { connection?: { saveData?: boolean } }

const lowPower = () => (navigator.hardwareConcurrency || 8) <= 4 || Boolean((navigator as SavingNavigator).connection?.saveData)

export const useDeferredMount = () => {
  const [mounted, setMounted] = useState(false)
  const small = useMediaQuery('(max-width: 767px)')
  const reduced = useReducedMotion()

  useEffect(() => {
    if (small && (reduced || lowPower())) return
    const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 200))
    const cancel = window.cancelIdleCallback ?? window.clearTimeout
    const handle = idle(() => setMounted(true))
    return () => cancel(handle)
  }, [small, reduced])

  return mounted
}
