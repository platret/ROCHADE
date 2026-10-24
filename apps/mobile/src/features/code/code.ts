export const codeLength = 6

export const normaliseCode = (raw: string) => raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, codeLength)
