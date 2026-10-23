import { cx } from '../lib/cx'

type Props = { live: boolean; lastChangeAt: Date | null }

const formatTime = (date: Date) => date.toLocaleTimeString('de-CH')

export const LiveIndicator = ({ live, lastChangeAt }: Props) => (
  <span className="inline-flex items-center gap-2 font-mono text-caption text-ink-muted">
    <span aria-hidden="true" className={cx('size-2 rounded-full', live ? 'bg-success' : 'bg-line-strong')} />
    {live ? 'Live' : 'Offline'}
    {lastChangeAt && ` · zuletzt ${formatTime(lastChangeAt)}`}
  </span>
)
