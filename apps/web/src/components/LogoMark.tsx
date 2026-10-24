import { logoShapes, logoViewBox } from '@rochade/shared'
import { cx } from '../lib/cx'

type Props = { size?: number; tone?: 'orange' | 'ink'; className?: string }

export const LogoMark = ({ size = 32, tone = 'orange', className }: Props) => (
  <svg
    viewBox={logoViewBox}
    width={size}
    height={size}
    fill="currentColor"
    className={cx(tone === 'orange' ? 'text-orange' : 'text-ink', className)}
    aria-hidden="true"
  >
    {logoShapes.map((shape, index) =>
      shape.kind === 'path' ? (
        <path key={index} d={shape.d} fillRule={'fillRule' in shape ? shape.fillRule : undefined} />
      ) : (
        <rect key={index} x={shape.x} y={shape.y} width={shape.width} height={shape.height} rx={shape.rx} />
      ),
    )}
  </svg>
)
