import { formatDate } from '@rochade/shared'
import type { Step } from './beats'
import { brunner } from './momentData'

const date = (iso: string | undefined) => (iso ? formatDate(iso) : '')

export const steps: { key: Step; text: string }[] = [
  { key: 'conflict', text: 'Herr Brunner hat in Etappe 3 keinen Platz' },
  { key: 'shift', text: 'Die Bauleitung verschiebt Etappe 3 um zwei Wochen' },
  { key: 'resolved', text: 'Plan neu gerechnet: keine Konflikte mehr' },
  { key: 'notified', text: 'Jeder Haushalt bekommt den neuen Termin aufs Handy' },
]

export const messages = {
  conflict: brunner.before?.reason ?? '',
  resolved: `Herr Brunner zieht am ${date(brunner.after?.moveOut)} in ${brunner.after?.tempLabel ?? 'die Rochade-Wohnung'}.`,
}
