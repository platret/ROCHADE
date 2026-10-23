const flatPrefix = 'Whg. '

export const splitFlatLabel = (label: string) =>
  label.startsWith(flatPrefix) ? { prefix: flatPrefix, number: label.slice(flatPrefix.length) } : { prefix: '', number: label }
