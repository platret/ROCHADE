import { formatDate, type ISODate } from '@rochade/shared'
import type { ReactNode } from 'react'
import { Text } from '@/ui/Text'
import { JourneyStep } from './JourneyStep'
import { CountdownText, DateHero } from './stepContent'
import { countdown, countdownParts, isSoon, type NodeState } from './steps'

export type DateStepProps = {
  index: number
  title: string
  date: ISODate | null
  today: ISODate
  state: NodeState
  current: number
  delay: number
  flashKey: number | null
  next: boolean
  note?: string
  children?: ReactNode
}

const missingDate = 'Termin folgt'
const missingDetail = 'Termin folgt. Du musst nichts tun.'

export const DateStep = ({ index, title, date, today, state, current, delay, flashKey, next, note, children }: DateStepProps) => {
  const parts = date !== null && next ? countdownParts(today, date) : null
  const soon = date !== null && next && isSoon(today, date)
  const dateDetail = date === null ? missingDate : parts === null ? formatDate(date) : `${formatDate(date)}, ${countdown(today, date)}`
  const detail = note === undefined ? dateDetail : `${dateDetail}, ${note}`
  return (
    <JourneyStep
      index={index}
      title={title}
      state={state}
      current={current}
      delay={delay}
      flashKey={flashKey}
      detail={detail}
      hero={soon && parts !== null ? <CountdownText parts={parts} hero playKey={flashKey} /> : <DateHero date={date} />}
    >
      {date === null && <Text color="inkMuted">{missingDetail}</Text>}
      {date !== null && soon && (
        <Text variant="mono" color="inkMuted">
          {formatDate(date)}
        </Text>
      )}
      {parts !== null && !soon && <CountdownText parts={parts} playKey={flashKey} />}
      {children}
    </JourneyStep>
  )
}
