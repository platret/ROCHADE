import { supabase } from '@/lib/supabase'
import { TopScreen } from '@/ui/TopScreen'
import { UnconfiguredState } from '@/ui/UnconfiguredState'
import { CodeForm } from './CodeForm'

export const CodeScreen = () => (
  <TopScreen contentStyle={{ flexGrow: 1 }}>{supabase ? <CodeForm client={supabase} /> : <UnconfiguredState />}</TopScreen>
)
