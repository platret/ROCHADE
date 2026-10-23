import { formatDate, toIsoDate } from '@rochade/shared'

const pad = (value: number) => String(value).padStart(2, '0')

export const formatTimestamp = (date: Date) =>
  `${formatDate(toIsoDate(date))}, ${pad(date.getHours())}:${pad(date.getMinutes())}`
