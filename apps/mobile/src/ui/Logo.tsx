import { Image } from 'react-native'

const tile = require('@/assets/images/logo-tile.png')

export type LogoProps = { size?: number }

export const Logo = ({ size = 40 }: LogoProps) => (
  <Image source={tile} style={{ width: size, height: size }} accessibilityRole="image" accessibilityLabel="ROCHADE Logo" />
)
