import { createContext, useCallback, useContext, useState, type PropsWithChildren } from 'react'
import { clearIdentity, readIdentity, writeIdentity, type Identity } from '@/lib/identity'
import { readIntroDone, writeIntroDone } from '@/lib/intro'

export type IdentityContextValue = {
  identity: Identity | null
  introDone: boolean
  signIn: (identity: Identity) => void
  signOut: () => void
  finishIntro: () => void
}

const IdentityContext = createContext<IdentityContextValue | null>(null)

export const IdentityProvider = ({ children }: PropsWithChildren) => {
  const [identity, setIdentity] = useState<Identity | null>(readIdentity)
  const [introDone, setIntroDone] = useState(readIntroDone)

  const finishIntro = useCallback(() => {
    writeIntroDone()
    setIntroDone(true)
  }, [])

  const signIn = useCallback(
    (next: Identity) => {
      writeIdentity(next)
      setIdentity(next)
      finishIntro()
    },
    [finishIntro],
  )

  const signOut = useCallback(() => {
    clearIdentity()
    setIdentity(null)
  }, [])

  return <IdentityContext value={{ identity, introDone, signIn, signOut, finishIntro }}>{children}</IdentityContext>
}

export const useIdentity = (): IdentityContextValue => {
  const value = useContext(IdentityContext)
  if (!value) throw new Error('useIdentity braucht einen IdentityProvider.')
  return value
}
