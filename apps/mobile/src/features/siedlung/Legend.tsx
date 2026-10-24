import { spacing } from '@rochade/shared'
import { View } from 'react-native'
import { Text } from '@/ui/Text'
import { Segment, Tick } from './Segment'
import { timelineLayout } from './timelineLayout'
import type { SegmentKind } from './timelineModel'

type LegendItem = { kind: SegmentKind; tick?: boolean; label: string }

const items: LegendItem[] = [
  { kind: 'home', label: 'Eigene Wohnung' },
  { kind: 'temp', label: 'Rochade-Wohnung' },
  { kind: 'home', tick: true, label: 'Umzugstag' },
  { kind: 'renovated', label: 'Renovierte Wohnung' },
  { kind: 'conflict', label: 'Konflikt' },
]

const { swatchWidth, swatchHeight, swatchRadius } = timelineLayout

export type LegendProps = { showConflict: boolean; highlightOwn: boolean }

export const Legend = ({ showConflict, highlightOwn }: LegendProps) => (
  <View style={{ gap: spacing.sm }}>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: spacing.lg, rowGap: spacing.sm }}>
      {items
        .filter((item) => showConflict || item.kind !== 'conflict')
        .map((item) => (
          <View
            key={item.label}
            accessible
            accessibilityRole="text"
            accessibilityLabel={`Legende: ${item.label}`}
            style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}
          >
            <View style={{ width: swatchWidth, height: swatchHeight, alignItems: 'center', justifyContent: 'center' }}>
              <Segment kind={item.kind} borderRadius={swatchRadius} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
              {item.tick && <Tick height={swatchHeight} />}
            </View>
            <Text variant="label" color="inkMuted">
              {item.label}
            </Text>
          </View>
        ))}
    </View>
    {highlightOwn && (
      <Text variant="label" color="inkMuted">
        Hervorgehoben: dein Haushalt
      </Text>
    )}
  </View>
)
