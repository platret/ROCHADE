import { cx } from '../lib/cx'

export type ButtonVariant = 'primary' | 'secondary'
export type ButtonSize = 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-orange-strong text-on-orange hover:opacity-90',
  secondary: 'border border-line-strong text-ink hover:bg-surface-sunken',
}

const sizes: Record<ButtonSize, string> = {
  md: 'gap-1.5 px-3 py-2 text-label',
  lg: 'min-h-12 gap-2 px-5 text-body font-semibold',
}

export const buttonClass = (variant: ButtonVariant, size: ButtonSize, className?: string) =>
  cx(
    'inline-flex items-center justify-center rounded-md outline-orange-strong transition-[opacity,background-color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )
