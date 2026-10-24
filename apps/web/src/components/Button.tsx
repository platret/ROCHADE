import type { ButtonHTMLAttributes } from 'react'
import { buttonClass, type ButtonSize, type ButtonVariant } from './buttonStyles'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }

export const Button = ({ variant = 'primary', size = 'md', className, type = 'button', ...rest }: Props) => (
  <button type={type} className={buttonClass(variant, size, className)} {...rest} />
)
