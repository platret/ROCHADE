import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { Color, PerspectiveCamera, Vector2, Vector3, type Mesh } from 'three'
import { colors, type ColorName, type ColorScheme } from '@rochade/shared'
import type { MotionState } from './motionState'
import { backdropFragment, planeVertex } from './shaders'

type Props = { scheme: ColorScheme; animate: boolean; state: MotionState }

const distance = 12
const forward = new Vector3()
const glow: Record<ColorScheme, ColorName> = { light: 'orangeSoft', dark: 'slateSoft' }

export const Backdrop = ({ scheme, animate, state }: Props) => {
  const mesh = useRef<Mesh>(null)
  const uniforms = useMemo(
    () => ({
      uPaper: { value: new Color() },
      uGlow: { value: new Color() },
      uCool: { value: new Color() },
      uSunken: { value: new Color() },
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uShift: { value: new Vector2() },
    }),
    [],
  )

  useEffect(() => {
    const palette = colors[scheme]
    uniforms.uPaper.value.set(palette.paper)
    uniforms.uGlow.value.set(palette[glow[scheme]])
    uniforms.uCool.value.set(palette.slateSoft)
    uniforms.uSunken.value.set(palette.surfaceSunken)
  }, [scheme, uniforms])

  useFrame(({ camera, size }, delta) => {
    const plane = mesh.current
    if (!plane || !(camera instanceof PerspectiveCamera)) return
    const height = 2 * distance * Math.tan((camera.fov * Math.PI) / 360) * 1.05
    const aspect = size.width / size.height
    camera.getWorldDirection(forward)
    plane.position.copy(camera.position).addScaledVector(forward, distance)
    plane.quaternion.copy(camera.quaternion)
    plane.scale.set(height * aspect, height, 1)
    if (animate) uniforms.uTime.value += Math.min(delta, 0.05)
    uniforms.uAspect.value = aspect
    uniforms.uShift.value.set(state.px * 0.02, -state.py * 0.02)
  })

  return (
    <mesh ref={mesh} renderOrder={-1} frustumCulled={false}>
      <planeGeometry />
      <shaderMaterial vertexShader={planeVertex} fragmentShader={backdropFragment} uniforms={uniforms} depthWrite={false} depthTest={false} />
    </mesh>
  )
}
