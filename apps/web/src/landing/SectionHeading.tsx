import { cx } from '../lib/cx'

type Props = { id: string; eyebrow: string; title: string; lead?: string; className?: string }

export const SectionHeading = ({ id, eyebrow, title, lead, className }: Props) => (
  <div className={cx('max-w-2xl', className)}>
    <p className="text-label text-ink-muted">{eyebrow}</p>
    <h2 id={id} className="mt-2 text-h2 text-balance md:text-h1">
      {title}
    </h2>
    {lead && <p className="mt-3 text-body text-pretty text-ink-muted">{lead}</p>}
  </div>
)
