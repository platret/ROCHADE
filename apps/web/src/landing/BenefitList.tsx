import { Check } from 'lucide-react'

export const BenefitList = ({ items }: { items: string[] }) => (
  <ul className="mt-6 space-y-3">
    {items.map((item) => (
      <li key={item} className="flex gap-3 text-body text-ink">
        <Check size={20} className="mt-0.5 shrink-0 text-ink-muted" aria-hidden="true" />
        {item}
      </li>
    ))}
  </ul>
)
