import { CircleCheck, TriangleAlert } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { cx } from '../../lib/cx'
import type { Step } from './beats'
import { messages, steps } from './captions'
import { ease } from './Segment'

export const MessageLine = ({ resolved }: { resolved: boolean }) => (
  <div className="relative mt-4 min-h-10 border-t border-line pt-3 lg:mt-0 lg:border-t-0 lg:pt-0">
    <AnimatePresence mode="wait" initial={false}>
      <motion.p
        key={String(resolved)}
        className="flex items-start gap-2 text-body-sm text-ink"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease }}
      >
        {resolved ? (
          <CircleCheck size={16} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
        ) : (
          <TriangleAlert size={16} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
        )}
        {resolved ? messages.resolved : messages.conflict}
      </motion.p>
    </AnimatePresence>
  </div>
)

export const MomentCaption = ({ step }: { step: Step | null }) => (
  <ol className="mt-4 max-w-2xl list-decimal space-y-1.5 pl-5 text-body">
    {steps.map((item) => (
      <li
        key={item.key}
        aria-current={step === item.key ? 'step' : undefined}
        className={cx('pl-1 transition-colors duration-300', step === null || step === item.key ? 'text-ink' : 'text-ink-muted')}
      >
        {item.text}
      </li>
    ))}
  </ol>
)
