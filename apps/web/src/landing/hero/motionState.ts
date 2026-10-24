export type MotionState = { time: number; y: number; px: number; py: number }

export const createMotionState = (): MotionState => ({ time: 0, y: 0, px: 0, py: 0 })

export const floatAmplitude = 0.08
