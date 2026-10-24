import { radius, spacing } from '@rochade/shared'
import { StyleSheet, View } from 'react-native'
import { useTheme } from '@/theme/useTheme'
import { Text } from '@/ui/Text'
import { Segment, Tick } from './Segment'
import { timelineLayout } from './timelineLayout'
import type { SegmentKind } from './timelineModel'

type LegendItem = { kind: SegmentKind | 'own'; tick?: boolean; label: string }

const items: LegendItem[] = [
  { kind: 'home', label: 'Eigene Wohnung' },
  { kind: 'temp', label: 'Rochade-Wohnung' },
  { kind: 'home', tick: true, label: 'Umzugstag' },
  { kind: 'renovated', label: 'Renovierte Wohnung' },
  { kind: 'conflict', label: 'Konflikt' },
  { kind: 'own', tick: true, label: 'Dein Haushalt' },
]

const { swatchWidth, swatchHeight, swatchRadius } = timelineLayout
const chipPaddingVertical = 3

const Swatch = ({ item }: { item: LegendItem }) => {
  const { colors } = useTheme()
  return (
    <View style={{ width: swatchWidth, height: swatchHeight, alignItems: 'center', justifyContent: 'center' }}>
      {item.kind === 'own' ? (
        <View style={[StyleSheet.absoluteFill, { borderRadius: swatchRadius, backgroundColor: colors.slateSoft }]} />
      ) : (
        <Segment kind={item.kind} borderRadius={swatchRadius} style={StyleSheet.absoluteFill} />
      )}
      {item.tick && <Tick own={item.kind === 'own'} height={swatchHeight} />}
    </View>
  )
}

export type LegendProps = { showConflict: boolean; highlightOwn: boolean }

export const Legend = ({ showConflict, highlightOwn }: LegendProps) => {
  const { colors } = useTheme()
  const shown = items.filter((item) => (item.kind !== 'conflict' || showConflict) && (item.kind !== 'own' || highlightOwn))
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
      {shown.map((item) => (
        <View
          key={item.label}
          accessible
          accessibilityRole="text"
          accessibilityLabel={`Legende: ${item.label}`}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            paddingVertical: chipPaddingVertical,
            paddingHorizontal: spacing.sm,
            borderRadius: radius.sm,
            borderWidth: 1,
            borderColor: colors.line,
            backgroundColor: colors.surface,
          }}
        >
          <Swatch item={item} />
          <Text variant="label" color="inkMuted">
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  )
}
