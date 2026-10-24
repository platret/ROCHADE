import { supabase } from '@/lib/supabase'
import { TopScreen } from '@/ui/TopScreen'
import { UnconfiguredState } from '@/ui/UnconfiguredState'
import { CodeForm } from './CodeForm'

export const CodeScreen = () => (
  <TopScreen>{supabase ? <CodeForm client={supabase} /> : <UnconfiguredState />}</TopScreen>
)
