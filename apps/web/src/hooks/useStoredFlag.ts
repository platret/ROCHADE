import { useCallback, useState } from 'react'

const read = (key: string) => {
  try {
    return localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

export const useStoredFlag = (key: string) => {
  const [flag, setFlag] = useState(() => read(key))
  const update = useCallback(
    (next: boolean) => {
      setFlag(next)
      try {
        localStorage.setItem(key, next ? '1' : '0')
      } catch {
        return
      }
    },
    [key],
  )
  return [flag, update] as const
}
