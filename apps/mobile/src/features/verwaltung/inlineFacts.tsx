import type { PropsWithChildren } from 'react'
import { splitFlatLabel } from '@/lib/flats'
import { Text } from '@/ui/Text'

export const Mono = ({ children }: PropsWithChildren) => (
  <Text variant="monoSm" color="inkMuted">
    {children}
  </Text>
)

export type FlatLabelProps = { label: string }

export const FlatLabel = ({ label }: FlatLabelProps) => {
  const { prefix, number } = splitFlatLabel(label)
  return (
    <>
      {prefix}
      <Mono>{number}</Mono>
    </>
  )
}
