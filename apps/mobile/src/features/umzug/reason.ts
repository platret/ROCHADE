import { dativeName } from '@rochade/shared'

const nonBreakingHyphen = '‑'

const keepFlatTogether = (text: string) => text.replace(/-Zimmer-Wohnung/g, `${nonBreakingHyphen}Zimmer${nonBreakingHyphen}Wohnung`)

export const residentReason = (reason: string, householdName: string) => {
  const adminLead = `Für ${dativeName(householdName)} fehlt`
  const personal = reason.startsWith(adminLead) ? `Für deinen Haushalt fehlt${reason.slice(adminLead.length)}` : reason
  return keepFlatTogether(personal)
}
