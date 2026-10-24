import { AnimatePresence, motion } from 'motion/react'
import { MousePointer2 } from 'lucide-react'
import type { Phase } from '@rochade/shared'
import { pct, widthPct } from './momentData'
import { ease } from './Segment'

type Props = { phases: Phase[]; movingId: string; shifted: boolean; cursor: boolean }

const bandClass = 'absolute top-0 flex h-6 items-center overflow-hidden rounded-sm border border-line bg-surface-sunken px-2 text-label whitespace-nowrap text-ink'

export const PhaseBands = ({ phases, movingId, shifted, cursor }: Props) => (
  <div className="relative h-6">
    {phases.map((phase) => (
      <motion.div
        key={phase.id}
        className={bandClass}
        initial={false}
        animate={{ left: `calc(${pct(phase.start_date)}% + 1px)`, width: `calc(${widthPct(phase.start_date, phase.end_date)}% - 2px)` }}
        transition={{ duration: shifted && phase.id === movingId ? 0.7 : 0, ease }}
      >
        <span className="hidden sm:inline">{phase.name}</span>
        <span className="sm:hidden">E{phase.sort_order}</span>
        <span className="hidden min-[480px]:inline">&nbsp;· {phase.building}</span>
      </motion.div>
    ))}
    <AnimatePresence>
      {cursor &&
        phases
          .filter((phase) => phase.id === movingId)
          .map((phase) => (
            <motion.div
              key="cursor"
              className="absolute -top-2 z-10 flex h-7 items-center gap-1 rounded-sm bg-ink px-2 text-label whitespace-nowrap text-paper"
              initial={{ opacity: 0, scale: 0.9, left: `${pct(phase.end_date)}%` }}
              animate={{ opacity: 1, scale: 1, left: `${pct(phase.end_date)}%` }}
              exit={{ opacity: 0 }}
              transition={{ duration: shifted ? 0.7 : 0.25, ease }}
            >
              <MousePointer2 size={12} aria-hidden="true" />
              +2 Wochen
            </motion.div>
          ))}
    </AnimatePresence>
  </div>
)
