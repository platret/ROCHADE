import { formatDate, formatFloor } from '@rochade/shared'
import type { CalendarEntry } from '@/lib/calendar'
import type { WohnungPlan } from './plan'

const signature = 'Eingetragen von ROCHADE.'

const notes = (...lines: (string | null)[]) => lines.filter((line) => line !== null).join('\n')

export const calendarEntries = ({ tempFlat, homeFlat, moveOut, moveBack }: WohnungPlan): CalendarEntry[] => {
  const place = `${tempFlat.label}, ${tempFlat.building}, ${formatFloor(tempFlat.floor)}`
  const entries: CalendarEntry[] = []
  if (moveOut) {
    entries.push({
      date: moveOut,
      title: `Auszug: Rochade-Wohnung ${tempFlat.label}`,
      notes: notes(`Umzug in die Rochade-Wohnung ${place}.`, moveBack ? `Rückkehr am ${formatDate(moveBack)}.` : null, signature),
    })
  }
  if (moveBack) {
    entries.push({
      date: moveBack,
      title: homeFlat ? `Rückkehr: ${homeFlat.label}` : 'Rückkehr in deine Wohnung',
      notes: notes(`Zurück in ${homeFlat?.label ?? 'deine Wohnung'} nach der Zeit in der Rochade-Wohnung ${tempFlat.label}.`, signature),
    })
  }
  return entries
}
