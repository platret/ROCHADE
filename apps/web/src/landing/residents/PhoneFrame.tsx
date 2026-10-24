import { cx } from '../../lib/cx'

type Props = { src: string; darkSrc: string; alt: string; className?: string }

export const PhoneFrame = ({ src, darkSrc, alt, className }: Props) => (
  <div className={cx('rounded-[48px] bg-ink p-3 shadow-mock', className)}>
    <picture>
      <source srcSet={darkSrc} media="(prefers-color-scheme: dark)" />
      <img src={src} alt={alt} width={816} height={1774} loading="lazy" decoding="async" className="block w-full rounded-[36px]" />
    </picture>
  </div>
)
