import { createContext, useCallback, useContext, useRef } from 'react'

type Listener = () => void

export type ScrollSubscribe = (listener: Listener) => () => void

export const ScrollEventsContext = createContext<ScrollSubscribe>(() => () => undefined)

export const useScrollSubscribe = () => useContext(ScrollEventsContext)

export const useScrollEvents = () => {
  const listeners = useRef(new Set<Listener>())
  const subscribe = useCallback<ScrollSubscribe>((listener) => {
    listeners.current.add(listener)
    return () => {
      listeners.current.delete(listener)
    }
  }, [])
  const onScroll = () => {
    for (const listener of listeners.current) listener()
  }
  return { subscribe, onScroll }
}
