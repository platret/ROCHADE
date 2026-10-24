import { useRef, useState, type ComponentRef } from 'react'
import { useWindowDimensions, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollView } from 'react-native'
import { useReducedMotion } from 'react-native-reanimated'
import { haptics } from '@/lib/haptics'

export const useIntroPager = (count: number) => {
  const { width } = useWindowDimensions()
  const reduceMotion = useReducedMotion()
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null)
  const [page, setPage] = useState(0)

  const settle = (next: number) => {
    if (next === page || next < 0 || next >= count) return
    haptics.selection()
    setPage(next)
  }

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => settle(Math.round(event.nativeEvent.contentOffset.x / width))

  const goTo = (next: number) => {
    scrollRef.current?.scrollTo({ x: next * width, animated: !reduceMotion })
    if (reduceMotion) settle(next)
  }

  return { width, scrollRef, page, onScroll, goTo }
}
