import { motion } from 'motion/react'
import { cx } from '../../lib/cx'
import { pct, widthPct, type Stay } from './momentData'

export type SegmentKind = 'home' | 'temp' | 'back' | 'conflict'

const styles: Record<SegmentKind, string> = {
  home: 'bg-line',
  temp: 'bg-slate',
  back: 'border-[1.5px] border-orange bg-line',
  conflict: 'border-[1.5px] border-dashed border-danger bg-surface',
}

export const ease = [0.4, 0, 0.2, 1] as const

type Props = { stay: Stay; kind: SegmentKind; instant: boolean; className?: string }

export const Segment = ({ stay, kind, instant, className }: Props) => (
  <motion.div
    className={cx('absolute top-0 h-4 rounded-sm', styles[kind], className)}
    initial={false}
    animate={{ left: `calc(${pct(stay.start)}% + 1px)`, width: `calc(${widthPct(stay.start, stay.end)}% - 2px)` }}
    transition={{ duration: instant ? 0 : 0.7, ease }}
  />
)

export const MoveTick = ({ date, instant }: { date: string; instant: boolean }) => (
  <motion.div
    className="absolute -top-1 h-6 w-0.5 bg-orange"
    initial={false}
    animate={{ left: `calc(${pct(date)}% - 1px)` }}
    transition={{ duration: instant ? 0 : 0.7, ease }}
  />
)
