import { AnimatePresence, motion } from 'motion/react'
import { StatusBadge } from '../../components/StatusBadge'
import { cx } from '../../lib/cx'
import type { RowFrame } from './momentData'
import { ease, MoveTick, Segment } from './Segment'

type Props = { before: RowFrame; after: RowFrame; shifted: boolean; resolved: boolean }

export const rowGrid = 'grid grid-cols-[44px_1fr_auto] items-center gap-3 sm:grid-cols-[150px_1fr_112px]'

export const TimelineRow = ({ before, after, shifted, resolved }: Props) => {
  const frame = shifted ? after : before
  const status = resolved ? after.status : before.status
  const conflict = status === 'conflict'
  const changed = before.status !== after.status
  return (
    <div className={cx(rowGrid, 'relative h-10')}>
      {changed && resolved && <div aria-hidden="true" className="absolute -inset-x-2 inset-y-0 rounded-sm animate-flash" />}
      <div className="relative flex items-center gap-2">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-sunken text-label text-ink">{frame.initials}</span>
        <span aria-hidden="true" className={cx('size-1.5 shrink-0 rounded-full bg-danger transition-opacity duration-200', conflict ? 'opacity-100' : 'opacity-0')} />
        <span className="hidden truncate text-body-sm text-ink sm:inline">{frame.name}</span>
      </div>
      <div className="relative h-4">
        <Segment stay={frame.home} kind="home" instant={!shifted} />
        <Segment stay={frame.away} kind="temp" instant={!shifted} className={cx('transition-opacity duration-200', conflict && 'opacity-0')} />
        <Segment stay={frame.away} kind="conflict" instant={!shifted} className={cx('transition-opacity duration-200', !conflict && 'opacity-0')} />
        <Segment stay={frame.back} kind="back" instant={!shifted} />
        <MoveTick date={frame.moveOut} instant={!shifted} />
      </div>
      <div className="relative flex justify-end">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={status}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease }}
          >
            <StatusBadge status={status} compact />
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}
