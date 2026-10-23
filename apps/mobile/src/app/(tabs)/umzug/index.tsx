import { useIdentity } from '@/data/IdentityProvider'
import { PlaceholderScreen } from '@/features/placeholder/PlaceholderScreen'
import { Button } from '@/ui/Button'

export default function Umzug() {
  const { signOut } = useIdentity()
  return (
    <PlaceholderScreen
      title="Mein Umzug"
      footer={<Button variant="ghost" label="Haushalt wechseln" icon="arrow.left.arrow.right" onPress={signOut} />}
    />
  )
}
