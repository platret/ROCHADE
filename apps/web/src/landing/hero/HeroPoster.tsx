import { LogoMark } from '../../components/LogoMark'
import { cx } from '../../lib/cx'

export const HeroPoster = ({ faded }: { faded: boolean }) => (
  <div
    role="img"
    aria-label="ROCHADE-Signet: Turm mit Hausdach"
    className={cx('absolute inset-0 grid place-items-center transition-opacity duration-300', faded && 'opacity-0')}
  >
    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_52%,var(--orange-soft)_0%,transparent_62%)]" />
    <LogoMark className="relative h-[56%] w-auto" />
  </div>
)
