import { addDays, formatDate, type Assignment, type ISODate } from '@rochade/shared'

export type DueKind = 'bis' | 'am'

export type ChecklistItem = { id: string; title: string; due: ISODate; kind: DueKind }

type Anchor = 'move_out' | 'move_back'

type Template = { id: string; title: string; anchor: Anchor; offset: number }

const templates: Template[] = [
  { id: 'umzugsfirma', title: 'Umzugsfirma anfragen', anchor: 'move_out', offset: -42 },
  { id: 'nachsendeauftrag', title: 'Nachsendeauftrag bei der Post', anchor: 'move_out', offset: -14 },
  { id: 'adresse', title: 'Adresse bei Gemeinde und Versicherung melden', anchor: 'move_out', offset: -7 },
  { id: 'kartons', title: 'Kartons packen', anchor: 'move_out', offset: -2 },
  { id: 'schluessel-rochade', title: 'Schlüsselübergabe Rochade-Wohnung', anchor: 'move_out', offset: 0 },
  { id: 'rueckzug', title: 'Rückzug vorbereiten', anchor: 'move_back', offset: -7 },
  { id: 'schluessel-zurueck', title: 'Schlüssel zurückgeben', anchor: 'move_back', offset: 0 },
]

const itemFor = ({ id, title, offset }: Template, anchorDate: ISODate): ChecklistItem => ({
  id,
  title,
  due: addDays(anchorDate, offset),
  kind: offset === 0 ? 'am' : 'bis',
})

export const checklistItems = (assignment: Assignment): ChecklistItem[] => {
  if (assignment.status !== 'ok') return []
  return templates.flatMap((template) => {
    const anchorDate = assignment[template.anchor]
    return anchorDate === null ? [] : [itemFor(template, anchorDate)]
  })
}

export const dueLabel = (item: ChecklistItem) => `${item.kind} ${formatDate(item.due)}`

export const isOverdue = (item: ChecklistItem, today: ISODate) => today > item.due
