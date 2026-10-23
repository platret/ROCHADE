import { createContext, useCallback, useContext, useState, type PropsWithChildren } from 'react'
import { clearIdentity, readIdentity, writeIdentity, type Identity } from '@/lib/identity'

export type IdentityContextValue = {
  identity: Identity | null
  signIn: (identity: Identity) => void
  signOut: () => void
}

const IdentityContext = createContext<IdentityContextValue | null>(null)

export const IdentityProvider = ({ children }: PropsWithChildren) => {
  const [identity, setIdentity] = useState<Identity | null>(readIdentity)

  const signIn = useCallback((next: Identity) => {
    writeIdentity(next)
    setIdentity(next)
  }, [])

  const signOut = useCallback(() => {
    clearIdentity()
    setIdentity(null)
  }, [])

  return <IdentityContext value={{ identity, signIn, signOut }}>{children}</IdentityContext>
}

export const useIdentity = (): IdentityContextValue => {
  const value = useContext(IdentityContext)
  if (!value) throw new Error('useIdentity braucht einen IdentityProvider.')
  return value
}
