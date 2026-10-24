import { useEffect, useState } from 'react'

export const usePullToRefresh = (refreshing: boolean, onRefresh: (() => void) | undefined) => {
  const [pulled, setPulled] = useState(false)

  useEffect(() => {
    if (pulled && !refreshing) setPulled(false)
  }, [pulled, refreshing])

  const pull = () => {
    setPulled(true)
    onRefresh?.()
  }

  return { pulling: pulled && refreshing, pull }
}
