import { Dashboard } from './components/Dashboard'
import { Page } from './components/Page'
import { SetupNotice } from './components/SetupNotice'
import { supabase } from './lib/supabase'

export default function App() {
  return supabase ? (
    <Dashboard client={supabase} />
  ) : (
    <Page>
      <SetupNotice />
    </Page>
  )
}
