import { EmptyState } from './EmptyState'

export const UnconfiguredState = () => (
  <EmptyState
    symbol="gearshape"
    title="Supabase ist nicht konfiguriert"
    body="Lege die Datei apps/mobile/.env mit EXPO_PUBLIC_SUPABASE_URL und EXPO_PUBLIC_SUPABASE_ANON_KEY an und starte «expo start» neu."
  />
)
