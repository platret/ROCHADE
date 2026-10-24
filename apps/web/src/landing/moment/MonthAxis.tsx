import { formatMonthShort } from '@rochade/shared'
import { cx } from '../../lib/cx'
import { months, pct } from './momentData'
import { rowGrid } from './TimelineRow'

export const MonthGrid = () => (
  <div aria-hidden="true" className={cx(rowGrid, 'pointer-events-none absolute inset-0')}>
    <div />
    <div className="relative h-full">
      {months.map((month) => (
        <span key={month} className="absolute inset-y-0 w-px bg-line" style={{ left: `${pct(month)}%` }} />
      ))}
    </div>
    <div />
  </div>
)

export const MonthLabels = () => (
  <div className={cx(rowGrid, 'h-4')}>
    <div />
    <div className="relative h-4">
      {months.map((month) => (
        <span key={month} className="absolute text-label text-ink-muted max-sm:even:hidden" style={{ left: `${pct(month)}%` }}>
          {formatMonthShort(month)}
        </span>
      ))}
    </div>
    <div />
  </div>
)
