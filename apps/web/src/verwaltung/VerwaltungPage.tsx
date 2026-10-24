import { Dashboard } from '../components/Dashboard'
import { Page } from '../components/Page'
import { SetupNotice } from '../components/SetupNotice'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { supabase } from '../lib/supabase'

export default function VerwaltungPage() {
  useDocumentTitle('Verwaltung · ROCHADE')
  return supabase ? (
    <Dashboard client={supabase} />
  ) : (
    <Page>
      <SetupNotice />
    </Page>
  )
}
