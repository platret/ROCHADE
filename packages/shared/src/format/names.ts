export const dativeName = (name: string) => (name.startsWith('Herr ') ? `Herrn ${name.slice(5)}` : name)

export const initials = (name: string) => {
  const words = name.split(' ').filter(Boolean)
  const first = words[0]?.[0] ?? ''
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : ''
  return `${first}${last}`.toUpperCase()
}

export const formatRooms = (rooms: number) => `${rooms}-Zimmer`

export const formatFloor = (floor: number) => (floor === 0 ? 'EG' : `${floor}. OG`)
