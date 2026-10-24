import { Storage } from 'expo-sqlite/kv-store'

const keyFor = (householdId: string) => `checklist:${householdId}`

const isIdList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry: unknown) => typeof entry === 'string')

export const readChecklist = (householdId: string): string[] => {
  try {
    const raw = Storage.getItemSync(keyFor(householdId))
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return isIdList(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const writeChecklist = (householdId: string, doneIds: string[]) => {
  try {
    if (doneIds.length === 0) Storage.removeItemSync(keyFor(householdId))
    else Storage.setItemSync(keyFor(householdId), JSON.stringify(doneIds))
  } catch {
    return
  }
}
