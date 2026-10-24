import { formatDate, formatFloor, type Flat, type ISODate } from '@rochade/shared'
import { Share } from 'react-native'

export type PlanSummary = { moveOut: ISODate | null; moveBack: ISODate | null; tempFlat: Flat }

const title = 'Mein Umzug (ROCHADE)'

const dateOr = (date: ISODate | null) => (date ? formatDate(date) : 'Termin folgt')

const planShareText = ({ moveOut, moveBack, tempFlat }: PlanSummary) =>
  [
    title,
    `Auszug: ${dateOr(moveOut)}`,
    `Rochade-Wohnung: ${tempFlat.label}, ${tempFlat.building}, ${formatFloor(tempFlat.floor)}`,
    `Rückkehr: ${dateOr(moveBack)}`,
  ].join('\n')

export const sharePlan = async (summary: PlanSummary) => {
  const result = await Share.share({ message: planShareText(summary), title }, { subject: title, dialogTitle: title })
  return result.action === Share.sharedAction
}
