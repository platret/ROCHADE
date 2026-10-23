import { logoShapes, logoViewBox, type ColorName } from '@rochade/shared'
import Svg, { G, Path, Rect } from 'react-native-svg'
import { useTheme } from '@/theme/useTheme'

export type LogoProps = { size?: number; color?: ColorName; tile?: boolean }

export const Logo = ({ size = 40, color = 'orange', tile = false }: LogoProps) => {
  const { colors } = useTheme()
  return (
    <Svg width={size} height={size} viewBox={logoViewBox} accessibilityRole="image" accessibilityLabel="ROCHADE Logo">
      {tile && <Rect width={64} height={64} rx={16} fill={colors.orange} />}
      <G fill={tile ? colors.onOrange : colors[color]}>
        {logoShapes.map((shape, index) =>
          shape.kind === 'path' ? (
            <Path key={index} d={shape.d} fillRule={'fillRule' in shape ? shape.fillRule : undefined} />
          ) : (
            <Rect key={index} x={shape.x} y={shape.y} width={shape.width} height={shape.height} rx={shape.rx} />
          ),
        )}
      </G>
    </Svg>
  )
}
