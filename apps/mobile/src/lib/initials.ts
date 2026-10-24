import type { Household } from '@rochade/shared'

type Named = Pick<Household, 'id' | 'name'>

const salutations = new Set(['familie', 'fam.', 'herr', 'hr.', 'frau', 'fr.', 'und'])
const letterClusters = ['Sch', 'St', 'Ch', 'Ph', 'Th']
const maxExtensionRounds = 2

const nameWords = (name: string) => {
  const words = name.split(/\s+/).filter((word) => word.length > 0 && !salutations.has(word.toLowerCase()))
  return words.length > 0 ? words : [name.trim()]
}

const clusterLength = (word: string) => letterClusters.find((cluster) => word.startsWith(cluster))?.length ?? 2

const labelOf = (words: string[], extension: number) => {
  const surname = words[words.length - 1] ?? ''
  if (words.length === 1) return surname.slice(0, clusterLength(surname) + extension)
  return `${words[0]?.[0] ?? ''}${surname.slice(0, 1 + extension)}`
}

const clashing = (labels: string[], names: string[]) => {
  const namesByLabel = new Map<string, Set<string>>()
  labels.forEach((label, index) => {
    namesByLabel.set(label, (namesByLabel.get(label) ?? new Set<string>()).add(names[index] ?? ''))
  })
  return new Set([...namesByLabel].filter(([, distinct]) => distinct.size > 1).map(([label]) => label))
}

export const householdInitials = (households: readonly Named[]) => {
  const words = households.map((household) => nameWords(household.name))
  const names = words.map((parts) => parts.join(' '))
  const extensions = households.map(() => 0)
  for (let round = 0; round < maxExtensionRounds; round += 1) {
    const labels = words.map((parts, index) => labelOf(parts, extensions[index] ?? 0))
    const unresolved = clashing(labels, names)
    if (unresolved.size === 0) break
    labels.forEach((label, index) => {
      if (unresolved.has(label)) extensions[index] = (extensions[index] ?? 0) + 1
    })
  }
  const byId = new Map(households.map((household, index) => [household.id, labelOf(words[index] ?? [], extensions[index] ?? 0)]))
  return (householdId: string) => byId.get(householdId) ?? ''
}
