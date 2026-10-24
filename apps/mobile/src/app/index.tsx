import { Redirect } from 'expo-router'
import { useIdentity } from '@/data/IdentityProvider'

export default function Index() {
  const { identity } = useIdentity()
  return <Redirect href={identity ? '/umzug' : '/anmelden'} />
}
