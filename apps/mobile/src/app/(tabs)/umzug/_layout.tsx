import { useIdentity } from '@/data/IdentityProvider'
import { umzugTabTitle } from '@/features/navigation/umzugTab'
import { TabStack } from '@/ui/TabStack'

export default function UmzugLayout() {
  const { identity } = useIdentity()
  return <TabStack title={umzugTabTitle(identity)} />
}
