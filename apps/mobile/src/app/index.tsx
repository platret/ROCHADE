import { Redirect } from 'expo-router'
import { useIdentity } from '@/data/IdentityProvider'

export default function Index() {
  const { identity, introDone } = useIdentity()
  return <Redirect href={identity ? '/umzug' : introDone ? '/code' : '/intro'} />
}
