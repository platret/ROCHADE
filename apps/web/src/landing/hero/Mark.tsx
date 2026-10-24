import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { MeshStandardMaterial, type Group } from 'three'
import type { Palette } from '@rochade/shared'
import { floatAmplitude, type MotionState } from './motionState'
import { baseYaw, doorGeometry, doorTilt, roofRadius, spinPeriod, unit } from './markGeometry'
import type { PointerRef } from './usePointerParallax'

type Props = { palette: Palette; animate: boolean; pointer: PointerRef; state: MotionState }

const tau = Math.PI * 2

export const Mark = ({ palette, animate, pointer, state }: Props) => {
  const group = useRef<Group>(null)
  const ceramic = useMemo(() => new MeshStandardMaterial({ roughness: 0.75, metalness: 0 }), [])
  const doorMaterial = useMemo(() => new MeshStandardMaterial({ roughness: 0.85 }), [])
  const door = useMemo(doorGeometry, [])

  useEffect(() => {
    ceramic.color.set(palette.orange)
    doorMaterial.color.set(palette.orange).multiplyScalar(0.55)
  }, [palette, ceramic, doorMaterial])

  useFrame((_, delta) => {
    const node = group.current
    if (!node) return
    if (animate) state.time += Math.min(delta, 0.05)
    const target = pointer.current
    state.px += (target.x - state.px) * 0.06
    state.py += (target.y - state.py) * 0.06
    state.y = Math.sin((state.time * tau) / 6) * floatAmplitude
    node.position.set(state.px * 0.05, state.y - state.py * 0.03, 0)
    node.rotation.set(Math.sin((state.time * tau) / 9 + 1) * 0.07 + state.py * 0.08, baseYaw + (state.time * tau) / spinPeriod + state.px * 0.1, 0)
  })

  return (
    <group ref={group} rotation={[0, baseYaw, 0]}>
      <group scale={unit}>
        <mesh position={[0, 17, 0]} rotation={[0, Math.PI / 4, 0]} material={ceramic}>
          <coneGeometry args={[roofRadius, 22, 4]} />
        </mesh>
        <mesh position={[11, 18, 0]} material={ceramic}>
          <boxGeometry args={[6, 12, 6]} />
        </mesh>
        <mesh position={[0, 5, 0]} material={ceramic}>
          <boxGeometry args={[30, 2, 30]} />
        </mesh>
        <RoundedBox args={[38, 5, 38]} radius={1} position={[0, 1.5, 0]} material={ceramic} />
        <mesh position={[0, -2, 0]} material={ceramic}>
          <cylinderGeometry args={[9, 9.5, 2, 24]} />
        </mesh>
        <mesh position={[0, -11, 0]} material={ceramic}>
          <cylinderGeometry args={[10, 17, 16, 48]} />
        </mesh>
        <mesh geometry={door} material={doorMaterial} position={[0, -19, 15.1]} rotation={[-doorTilt, 0, 0]} />
        <mesh position={[0, -20, 0]} material={ceramic}>
          <cylinderGeometry args={[16, 16.5, 2, 24]} />
        </mesh>
        <RoundedBox args={[42, 7, 42]} radius={2} position={[0, -24.5, 0]} material={ceramic} />
      </group>
    </group>
  )
}
