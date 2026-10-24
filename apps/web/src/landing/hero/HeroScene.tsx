import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'
import { colors } from '@rochade/shared'
import { useColorScheme } from '../../hooks/useColorScheme'
import { Backdrop } from './Backdrop'
import { ContactShadow } from './ContactShadow'
import { FrameDriver } from './FrameDriver'
import { Mark } from './Mark'
import { createMotionState } from './motionState'
import { SceneLights } from './SceneLights'
import type { PointerRef } from './usePointerParallax'

type Props = { animate: boolean; pointer: PointerRef; onReady: () => void }

export default function HeroScene({ animate, pointer, onReady }: Props) {
  const scheme = useColorScheme()
  const state = useRef(createMotionState())
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      flat
      camera={{ position: [0, 1, 9.6], fov: 28 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      <FrameDriver active={animate} onReady={onReady} />
      <Backdrop scheme={scheme} animate={animate} state={state.current} />
      <SceneLights scheme={scheme} />
      <Mark palette={colors[scheme]} animate={animate} pointer={pointer} state={state.current} />
      <ContactShadow scheme={scheme} state={state.current} />
    </Canvas>
  )
}
