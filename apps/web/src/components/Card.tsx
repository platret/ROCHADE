import type { ReactNode } from 'react'
import { cx } from '../lib/cx'

type Props = { children: ReactNode; className?: string; padded?: boolean }

export const Card = ({ children, className, padded = true }: Props) => (
  <div className={cx('rounded-md border border-line bg-surface', padded && 'p-6', className)}>{children}</div>
)
