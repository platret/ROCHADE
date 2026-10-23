import type { ButtonHTMLAttributes } from 'react'
import { cx } from '../lib/cx'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }

const variants = {
  primary: 'bg-orange-strong text-on-orange hover:opacity-90',
  secondary: 'border border-line-strong text-ink hover:bg-surface-sunken',
}

export const Button = ({ variant = 'primary', className, type = 'button', ...rest }: Props) => (
  <button
    type={type}
    className={cx(
      'inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-label outline-orange-strong focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      variants[variant],
      className,
    )}
    {...rest}
  />
)
