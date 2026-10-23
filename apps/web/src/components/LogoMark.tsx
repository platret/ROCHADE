import { logoShapes, logoViewBox } from '@rochade/shared'

export const LogoMark = ({ size = 32 }: { size?: number }) => (
  <svg viewBox={logoViewBox} width={size} height={size} fill="currentColor" className="text-orange" aria-hidden="true">
    {logoShapes.map((shape, index) =>
      shape.kind === 'path' ? (
        <path key={index} d={shape.d} fillRule={'fillRule' in shape ? shape.fillRule : undefined} />
      ) : (
        <rect key={index} x={shape.x} y={shape.y} width={shape.width} height={shape.height} rx={shape.rx} />
      ),
    )}
  </svg>
)
