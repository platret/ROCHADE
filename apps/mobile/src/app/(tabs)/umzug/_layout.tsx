import { useIdentity } from '@/data/IdentityProvider'
import { TabStack } from '@/ui/TabStack'

export default function UmzugLayout() {
  const { identity } = useIdentity()
  return <TabStack title={identity?.kind === 'verwaltung' ? 'Übersicht' : 'Mein Umzug'} />
}
