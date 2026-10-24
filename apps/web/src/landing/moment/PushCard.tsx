import { formatDate, planUpdatedTitle } from '@rochade/shared'
import { AnimatePresence, motion } from 'motion/react'
import { LogoMark } from '../../components/LogoMark'
import { brunner } from './momentData'
import { ease } from './Segment'

export const PushCard = ({ visible }: { visible: boolean }) => (
  <AnimatePresence>
    {visible && brunner.before && brunner.after && (
      <motion.div
        className="absolute top-0 right-0 aspect-[9/16] w-[220px] rounded-[32px] bg-ink p-1.5 shadow-mock"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease }}
      >
        <div className="h-full rounded-[26px] bg-paper px-2.5 pt-5">
          <p className="text-center font-mono text-h2 font-medium text-ink">09:41</p>
          <div className="mt-5 rounded-md border border-line bg-surface p-2.5" role="status">
            <p className="flex items-center gap-1.5 text-label text-ink-muted">
              <LogoMark size={14} />
              ROCHADE · jetzt
            </p>
            <p className="mt-1 text-label text-ink">{planUpdatedTitle}</p>
            <p className="mt-0.5 text-label text-ink-muted">
              Auszug <span className="font-mono font-medium">{formatDate(brunner.before.moveOut)}</span> →{' '}
              <span className="font-mono font-medium">{formatDate(brunner.after.moveOut)}</span>
            </p>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
)
