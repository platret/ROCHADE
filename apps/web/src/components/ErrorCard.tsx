import { TriangleAlert } from 'lucide-react'
import { Button } from './Button'
import { Card } from './Card'

type Props = { message: string; onRetry: () => void }

export const ErrorCard = ({ message, onRetry }: Props) => (
  <Card className="space-y-4">
    <p className="flex items-center gap-2 text-danger" role="alert">
      <TriangleAlert size={18} className="shrink-0" />
      {message}
    </p>
    <Button variant="secondary" onClick={onRetry}>
      Erneut laden
    </Button>
  </Card>
)
