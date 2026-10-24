import { fetchHouseholdByInviteCode, fetchProjectByAdminCode, type RochadeClient } from '@rochade/shared'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { Keyboard } from 'react-native'
import { welcomeHref } from '@/features/welcome/route'
import { isConnectionFailure, withTimeout } from '@/lib/connectivity'
import { messageOf } from '@/lib/errors'
import { haptics } from '@/lib/haptics'
import type { Identity } from '@/lib/identity'
import { codeLength, normaliseCode } from './code'

export type CodeStatus = { kind: 'idle' } | { kind: 'loading' } | { kind: 'error'; message: string }

const idle: CodeStatus = { kind: 'idle' }
const invalidMessage = 'Dieser Code ist nicht gültig. Prüfe die sechs Zeichen im Brief.'
const offlineMessage = 'Keine Verbindung. Versuche es gleich noch einmal.'
const lookupTimeoutMs = 10_000

const resolveIdentity = async (client: RochadeClient, code: string): Promise<Identity | null> => {
  const household = await fetchHouseholdByInviteCode(client, code)
  if (household) return { kind: 'household', householdId: household.id }
  const project = await fetchProjectByAdminCode(client, code)
  return project ? { kind: 'verwaltung' } : null
}

const errorMessage = (error: unknown) => (isConnectionFailure(error) ? offlineMessage : messageOf(error))

export const useCodeSignIn = (client: RochadeClient) => {
  const [code, setCodeState] = useState('')
  const [status, setStatus] = useState<CodeStatus>(idle)
  const complete = code.length === codeLength

  const setCode = (raw: string) => {
    setCodeState(normaliseCode(raw))
    setStatus(idle)
  }

  useFocusEffect(useCallback(() => setStatus(idle), []))

  const fail = (message: string) => {
    haptics.warning()
    setStatus({ kind: 'error', message })
  }

  const lookUp = async () => {
    setStatus({ kind: 'loading' })
    try {
      const identity = await withTimeout(resolveIdentity(client, code), lookupTimeoutMs)
      if (!identity) {
        fail(invalidMessage)
        return
      }
      haptics.success()
      router.push(welcomeHref(identity))
    } catch (error) {
      fail(errorMessage(error))
    }
  }

  const submit = () => {
    if (!complete || status.kind === 'loading') return
    Keyboard.dismiss()
    void lookUp()
  }

  return { code, setCode, complete, status, submit }
}
