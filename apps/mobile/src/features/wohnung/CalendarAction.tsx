import { spacing } from '@rochade/shared'
import type { SFSymbol } from 'expo-symbols'
import { Linking, View } from 'react-native'
import type { CalendarEntry } from '@/lib/calendar'
import { Button } from '@/ui/Button'
import { Squeeze } from '@/ui/Squeeze'
import { Text } from '@/ui/Text'
import { ActionNotice } from './ActionNotice'
import { useCalendarExport } from './useCalendarExport'

export type CalendarActionProps = { householdId: string; entries: CalendarEntry[] }

const addLabel = 'In Kalender eintragen'
const addIcon: SFSymbol = 'calendar.badge.plus'

const noop = () => undefined
const openSettings = () => void Linking.openSettings()

const countLine = (count: number) => (count === 1 ? '1 Termin in deinem Kalender.' : `${count} Termine in deinem Kalender.`)

const hintLine = (count: number, stale: boolean) => {
  if (stale) return 'Die Termine haben sich seit dem letzten Eintrag geändert.'
  return count === 1 ? 'Als ganztägiger Termin in deinem Kalender.' : 'Als ganztägige Termine in deinem Kalender.'
}

const Hint = ({ children }: { children: string }) => (
  <Text variant="bodySm" color="inkMuted">
    {children}
  </Text>
)

export const CalendarAction = ({ householdId, entries }: CalendarActionProps) => {
  const { status, stale, error, run } = useCalendarExport(householdId, entries)
  if (entries.length === 0) {
    return (
      <View style={{ gap: spacing.sm }}>
        <Squeeze disabled>
          <Button label={addLabel} icon={addIcon} disabled onPress={noop} />
        </Squeeze>
        <Hint>Sobald die Termine feststehen, kannst du sie in deinen Kalender eintragen.</Hint>
      </View>
    )
  }
  if (status === 'done') {
    return (
      <ActionNotice
        symbol="checkmark.circle.fill"
        color="success"
        title="Eingetragen"
        body={countLine(entries.length)}
        action={{ label: 'Erneut eintragen', onPress: run }}
      />
    )
  }
  if (status === 'denied') {
    return (
      <ActionNotice
        symbol="calendar.badge.exclamationmark"
        color="inkMuted"
        title="Kalenderzugriff wurde abgelehnt."
        body="Du kannst ihn in den Einstellungen erlauben."
        action={{ label: 'Einstellungen öffnen', onPress: openSettings }}
      />
    )
  }
  const retry = status === 'error'
  return (
    <View style={{ gap: spacing.sm }}>
      {retry && (
        <ActionNotice alert symbol="exclamationmark.triangle.fill" color="danger" title="Eintragen hat nicht geklappt." body={error ?? undefined} />
      )}
      <Squeeze disabled={status === 'working'}>
        <Button
          label={retry ? 'Erneut versuchen' : stale ? 'Kalender aktualisieren' : addLabel}
          icon={retry ? 'arrow.clockwise' : stale ? 'arrow.triangle.2.circlepath' : addIcon}
          loading={status === 'working'}
          onPress={run}
        />
      </Squeeze>
      <Hint>{hintLine(entries.length, stale)}</Hint>
    </View>
  )
}
