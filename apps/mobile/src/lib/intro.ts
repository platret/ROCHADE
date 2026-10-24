import { Storage } from 'expo-sqlite/kv-store'

const storageKey = 'intro-done'

export const readIntroDone = (): boolean => {
  try {
    return Storage.getItemSync(storageKey) === '1'
  } catch {
    return false
  }
}

export const writeIntroDone = () => {
  try {
    Storage.setItemSync(storageKey, '1')
  } catch {
    return
  }
}
