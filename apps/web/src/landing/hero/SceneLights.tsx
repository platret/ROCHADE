import { Environment, Lightformer } from '@react-three/drei'
import { colors, type ColorScheme } from '@rochade/shared'

const warm = colors.light.paper
const cool = colors.light.slateSoft
const keyIntensity: Record<ColorScheme, number> = { light: 1.7, dark: 0.9 }
const environmentIntensity: Record<ColorScheme, number> = { light: 0.2, dark: 0.12 }

export const SceneLights = ({ scheme }: { scheme: ColorScheme }) => (
  <>
    <hemisphereLight args={[warm, colors[scheme].line, 0.3]} />
    <directionalLight position={[-4.5, 3.5, 6]} intensity={keyIntensity[scheme]} color={warm} />
    <directionalLight position={[5, 1.5, -4]} intensity={0.45} color={cool} />
    <Environment resolution={64} frames={1} environmentIntensity={environmentIntensity[scheme]}>
      <Lightformer intensity={1} position={[-4, 3, 4]} scale={[6, 6, 1]} color={warm} />
      <Lightformer intensity={0.4} position={[4, 2, -3]} scale={[4, 4, 1]} color={cool} />
    </Environment>
  </>
)
