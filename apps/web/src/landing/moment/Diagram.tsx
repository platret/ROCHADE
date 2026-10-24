import { demoIds, demoProject } from '@rochade/shared'
import { cx } from '../../lib/cx'
import type { Flags } from './beats'
import { frames } from './momentData'
import { MonthGrid, MonthLabels } from './MonthAxis'
import { PhaseBands } from './PhaseBands'
import { rowGrid, TimelineRow } from './TimelineRow'

const story = `Umzugsplan der ${demoProject.name} von März bis Dezember 2027: Etappe 3 verschiebt sich um zwei Wochen, der Konflikt von Herrn Brunner löst sich, alle vier Haushalte sind zugeteilt.`

export const Diagram = ({ flags }: { flags: Flags }) => {
  const frame = flags.shifted ? frames.after : frames.before
  return (
    <div role="img" aria-label={story} className={cx('transition-opacity duration-250', flags.hidden && 'opacity-0')}>
      <div className={rowGrid}>
        <div />
        <PhaseBands phases={frame.phases} movingId={demoIds.phase3} shifted={flags.shifted} cursor={flags.cursor} />
        <div />
      </div>
      <div className="relative mt-3">
        <MonthGrid />
        <div className="relative space-y-0">
          {frames.before.rows.map((before, index) => {
            const after = frames.after.rows[index]
            return after ? <TimelineRow key={before.id} before={before} after={after} shifted={flags.shifted} resolved={flags.resolved} /> : null
          })}
        </div>
      </div>
      <div className="mt-2">
        <MonthLabels />
      </div>
    </div>
  )
}
