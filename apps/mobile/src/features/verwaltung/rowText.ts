import { formatDate, formatPeriod, statusLabels, type Period } from '@rochade/shared'
import { splitFlatLabel } from '@/lib/flats'
import type { OverviewRow } from './overview'

export const noHomeFlat = 'Ohne eigene Wohnung'
export const tempFlatPending = 'Wohnung folgt'

const enDash = '–'

export const periodRange = (period: Period) => `${formatDate(period.start)} ${enDash} ${formatDate(period.end)}`

const flatNumber = (label: string) => splitFlatLabel(label).number

export const describeRow = ({ household, homeFlat, tempFlat, status, period, reason }: OverviewRow) => {
  const parts = [household.name, homeFlat ? `Wohnung ${flatNumber(homeFlat.label)}, ${homeFlat.building}` : noHomeFlat, statusLabels[status]]
  if (status === 'ok') {
    parts.push(tempFlat ? `Rochade-Wohnung ${flatNumber(tempFlat.label)}` : `Rochade-${tempFlatPending}`)
    if (period) parts.push(`vom ${formatPeriod(period)}`)
  }
  if (status === 'conflict' && reason) parts.push(reason)
  return parts.join(', ')
}
