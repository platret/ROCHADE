import { updateHouseholdNeeds, type Household } from '@rochade/shared'
import { useState } from 'react'
import { useProject } from '@/data/ProjectProvider'
import { messageOf } from '@/lib/errors'
import { haptics } from '@/lib/haptics'
import { supabase } from '@/lib/supabase'
import { formFromHousehold, isDirty, needsFromForm, type NeedsForm } from './needs'

export type SavePhase = 'idle' | 'saving' | 'saved'

export const useWishesForm = (household: Household) => {
  const { reloadSilently } = useProject()
  const [initial] = useState(() => formFromHousehold(household))
  const [form, setForm] = useState(initial)
  const [phase, setPhase] = useState<SavePhase>('idle')
  const [error, setError] = useState<string | null>(null)

  const update = <Key extends keyof NeedsForm>(key: Key, value: NeedsForm[Key]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const save = async () => {
    if (!supabase) return
    setPhase('saving')
    setError(null)
    try {
      await updateHouseholdNeeds(supabase, household.id, needsFromForm(form))
      haptics.success()
      setPhase('saved')
      reloadSilently()
    } catch (caught) {
      haptics.error()
      setError(messageOf(caught))
      setPhase('idle')
    }
  }

  return { form, update, dirty: isDirty(form, initial), phase, error, save }
}
