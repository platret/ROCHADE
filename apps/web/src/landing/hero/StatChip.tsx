import { cx } from '../../lib/cx'

type Props = { value: number | undefined; label: string; dot?: 'success' | 'danger' }

export const StatChip = ({ value, label, dot }: Props) => (
  <span className="inline-flex h-8 items-center gap-2 rounded-sm border border-line bg-surface px-3 text-body-sm text-ink-muted">
    {dot && <span aria-hidden="true" className={cx('size-1.5 rounded-full', dot === 'danger' ? 'bg-danger' : 'bg-success')} />}
    {value === undefined ? (
      <span aria-hidden="true" className="h-3 w-5 animate-pulse rounded-sm bg-surface-sunken" />
    ) : (
      <span className="font-mono text-body-sm font-medium text-ink">{value}</span>
    )}
    {label}
  </span>
)
