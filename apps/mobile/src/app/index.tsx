import { Redirect } from 'expo-router'
import { useIdentity } from '@/data/IdentityProvider'
import { AnmeldenScreen } from '@/features/anmelden/AnmeldenScreen'

export default function Index() {
  const { identity } = useIdentity()
  if (identity) return <Redirect href="/umzug" />
  return <AnmeldenScreen />
}
