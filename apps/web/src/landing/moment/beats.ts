export type Beat = 'conflict' | 'cursor' | 'shift' | 'resolved' | 'notified' | 'reset'
export type Step = 'conflict' | 'shift' | 'resolved' | 'notified'

export type Flags = { shifted: boolean; resolved: boolean; cursor: boolean; push: boolean; hidden: boolean; step: Step | null }

export const loopMs = 11400
export const firstBeat: Beat = 'conflict'

const timeline: [number, Beat][] = [
  [0, 'conflict'],
  [3400, 'cursor'],
  [4100, 'shift'],
  [5800, 'resolved'],
  [7400, 'notified'],
  [11000, 'reset'],
]

export const beatAt = (elapsed: number): Beat => timeline.reduce<Beat>((current, [at, beat]) => (elapsed >= at ? beat : current), firstBeat)

const steps: Record<Beat, Step> = { conflict: 'conflict', cursor: 'shift', shift: 'shift', resolved: 'resolved', notified: 'notified', reset: 'notified' }

export const beatFlags = (beat: Beat): Flags => ({
  shifted: beat === 'shift' || beat === 'resolved' || beat === 'notified' || beat === 'reset',
  resolved: beat === 'resolved' || beat === 'notified' || beat === 'reset',
  cursor: beat === 'cursor' || beat === 'shift',
  push: beat === 'notified' || beat === 'reset',
  hidden: beat === 'reset',
  step: steps[beat],
})

export const staticFlags = (after: boolean): Flags => ({
  shifted: after,
  resolved: after,
  cursor: false,
  push: after,
  hidden: false,
  step: null,
})
