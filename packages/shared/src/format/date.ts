import type { ISODate, Period } from '../types'

const DAY_MS = 86_400_000

const toUtcMs = (iso: ISODate) => {
  const [year, month, day] = iso.split('-').map(Number)
  return Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1)
}

const pad = (value: number) => String(value).padStart(2, '0')

export const toIsoDate = (date: Date): ISODate =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

export const todayIso = (): ISODate => toIsoDate(new Date())

export const formatDate = (iso: ISODate) => {
  const [year, month, day] = iso.split('-')
  return `${day}.${month}.${year}`
}

export const formatPeriod = (period: Period) => `${formatDate(period.start)} bis ${formatDate(period.end)}`

export const daysBetween = (from: ISODate, to: ISODate) => Math.round((toUtcMs(to) - toUtcMs(from)) / DAY_MS)

export const addDays = (iso: ISODate, days: number): ISODate => {
  const date = new Date(toUtcMs(iso) + days * DAY_MS)
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
}

export const periodsOverlap = (a: Period, b: Period) => a.start <= b.end && b.start <= a.end

export const periodLengthDays = (period: Period) => daysBetween(period.start, period.end) + 1

export const monthStart = (iso: ISODate): ISODate => `${iso.slice(0, 7)}-01`

export const monthShortNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'] as const

export const formatMonthShort = (iso: ISODate) => monthShortNames[Number(iso.slice(5, 7)) - 1] ?? ''
