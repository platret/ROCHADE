type Value = string | ((prevValue: string | null) => string)

const getItemSync = (key: string) => localStorage.getItem(key)

const setItemSync = (key: string, value: Value) => {
  localStorage.setItem(key, typeof value === 'function' ? value(getItemSync(key)) : value)
}

const removeItemSync = (key: string) => {
  const existed = getItemSync(key) !== null
  localStorage.removeItem(key)
  return existed
}

export const Storage = {
  getItemSync,
  setItemSync,
  removeItemSync,
  getItemAsync: async (key: string) => getItemSync(key),
  setItemAsync: async (key: string, value: Value) => setItemSync(key, value),
  removeItemAsync: async (key: string) => removeItemSync(key),
}

export const AsyncStorage = Storage

export default Storage
