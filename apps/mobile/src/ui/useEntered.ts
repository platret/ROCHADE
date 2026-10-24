import { useIsFocused } from 'expo-router'
import { createContext, useContext, useEffect, useState } from 'react'
import { useReducedMotion } from 'react-native-reanimated'

export const screenEnterMs = 400

export const EnteredContext = createContext(true)

export const useEntered = () => useContext(EnteredContext)

export const useLatched = (value: boolean) => {
  const [latched, setLatched] = useState(value)
  useEffect(() => {
    if (value) setLatched(true)
  }, [value])
  return latched || value
}

export const useScreenEntered = () => {
  const focused = useIsFocused()
  const reduceMotion = useReducedMotion()
  const [settled, setSettled] = useState(reduceMotion)

  useEffect(() => {
    if (settled) return
    const timer = setTimeout(() => setSettled(true), screenEnterMs)
    return () => clearTimeout(timer)
  }, [settled])

  return useLatched(settled && focused)
}
