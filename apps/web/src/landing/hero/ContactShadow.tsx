import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { Color, type Mesh } from 'three'
import { colors, type ColorScheme } from '@rochade/shared'
import { floatAmplitude, type MotionState } from './motionState'
import { planeVertex, shadowFragment } from './shaders'

type Props = { scheme: ColorScheme; state: MotionState }

const baseOpacity: Record<ColorScheme, number> = { light: 0.35, dark: 0.5 }

export const ContactShadow = ({ scheme, state }: Props) => {
  const mesh = useRef<Mesh>(null)
  const uniforms = useMemo(() => ({ uColor: { value: new Color() }, uOpacity: { value: baseOpacity.light } }), [])

  useEffect(() => {
    uniforms.uColor.value.set(colors.light.ink)
  }, [uniforms])

  useFrame(() => {
    const lift = state.y / floatAmplitude
    uniforms.uOpacity.value = baseOpacity[scheme] - 0.08 * lift
    mesh.current?.scale.setScalar(1 - 0.08 * lift)
  })

  return (
    <mesh ref={mesh} rotation-x={-Math.PI / 2} position={[0, -1.02, 0]}>
      <circleGeometry args={[0.95, 48]} />
      <shaderMaterial vertexShader={planeVertex} fragmentShader={shadowFragment} uniforms={uniforms} transparent depthWrite={false} />
    </mesh>
  )
}
