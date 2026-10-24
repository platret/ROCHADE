import type { AnchorHTMLAttributes } from 'react'
import { Link } from 'react-router'
import { buttonClass, type ButtonSize, type ButtonVariant } from './buttonStyles'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; variant?: ButtonVariant; size?: ButtonSize }

export const ButtonLink = ({ to, variant = 'primary', size = 'md', className, ...rest }: Props) =>
  to.startsWith('/') ? (
    <Link to={to} className={buttonClass(variant, size, className)} {...rest} />
  ) : (
    <a href={to} className={buttonClass(variant, size, className)} {...rest} />
  )
