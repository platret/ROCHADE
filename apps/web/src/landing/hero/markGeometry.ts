import { ExtrudeGeometry, Shape } from 'three'

export const unit = 1 / 28
export const roofRadius = 22 * Math.SQRT2
export const doorTilt = Math.atan(7 / 16)
export const baseYaw = -Math.PI / 10
export const spinPeriod = 26

export const doorGeometry = () => {
  const shape = new Shape()
  shape.moveTo(-4, 0)
  shape.lineTo(4, 0)
  shape.lineTo(4, 7)
  shape.absarc(0, 7, 4, 0, Math.PI, false)
  shape.lineTo(-4, 0)
  return new ExtrudeGeometry(shape, { depth: 2, bevelEnabled: false })
}
