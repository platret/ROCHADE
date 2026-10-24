import { router, type Href } from 'expo-router'
import type { Identity } from '@/lib/identity'

export type WelcomeParams = { kind?: string; id?: string }

export const welcomeHref = (identity: Identity): Href => ({
  pathname: '/willkommen',
  params: identity.kind === 'household' ? { kind: 'household', id: identity.householdId } : { kind: 'verwaltung' },
})

export const identityFromParams = ({ kind, id }: WelcomeParams): Identity | null => {
  if (kind === 'verwaltung') return { kind: 'verwaltung' }
  return kind === 'household' && id ? { kind: 'household', householdId: id } : null
}

export const backToCode = () => {
  if (router.canGoBack()) router.back()
  else router.replace('/code')
}
