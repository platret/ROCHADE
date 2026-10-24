import { gutter, spacing, type Household } from '@rochade/shared'
import { router, Stack } from 'expo-router'
import { useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/theme/useTheme'
import { Card } from '@/ui/Card'
import { ListGroup } from '@/ui/ListGroup'
import { Field, type FieldHandle } from './Field'
import { noteMaxLength, schoolDistrictMaxLength } from './needs'
import { RoomsStepper } from './RoomsStepper'
import { SaveFooter } from './SaveFooter'
import { StepFreeRow } from './StepFreeRow'
import { useDiscardGuard } from './useDiscardGuard'
import { useWishesForm } from './useWishesForm'

const closeDelayMs = 800

export type WishesFormProps = { household: Household }

export const WishesForm = ({ household }: WishesFormProps) => {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const keyboard = useAnimatedKeyboard()
  const noteRef = useRef<FieldHandle>(null)
  const { form, update, dirty, phase, error, save } = useWishesForm(household)
  const saving = phase === 'saving'
  useDiscardGuard(dirty && phase !== 'saved', saving)

  useEffect(() => {
    if (phase !== 'saved') return
    const timer = setTimeout(() => router.back(), closeDelayMs)
    return () => clearTimeout(timer)
  }, [phase])

  const keyboardStyle = useAnimatedStyle(() => ({ paddingBottom: Math.max(keyboard.height.get() - insets.bottom, 0) }))

  return (
    <Animated.View style={[{ flex: 1, backgroundColor: colors.paper }, keyboardStyle]}>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button accessibilityLabel="Abbrechen" tintColor={colors.ink} disabled={saving} onPress={() => router.back()}>
          Abbrechen
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={{ paddingHorizontal: gutter, paddingTop: spacing.xl, paddingBottom: spacing.xxl, gap: spacing.xl }}
      >
        <ListGroup dividerInset={gutter}>
          <RoomsStepper value={form.rooms} onChange={(rooms) => update('rooms', rooms)} disabled={saving} />
          <StepFreeRow value={form.stepFree} onChange={(stepFree) => update('stepFree', stepFree)} disabled={saving} />
        </ListGroup>
        <Card>
          <Field
            label="Schulkreis"
            optional
            value={form.schoolDistrict}
            onChangeText={(text) => update('schoolDistrict', text)}
            placeholder={'z.\u00A0B.\u00A0Waidberg'}
            helper="Nur relevant, wenn Kinder im Haushalt zur Schule gehen."
            maxLength={schoolDistrictMaxLength}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => noteRef.current?.focus()}
            editable={!saving}
          />
        </Card>
        <Card>
          <Field
            ref={noteRef}
            label="Notiz"
            optional
            multiline
            counter
            value={form.note}
            onChangeText={(text) => update('note', text)}
            placeholder="Was die Verwaltung wissen sollte"
            maxLength={noteMaxLength}
            editable={!saving}
          />
        </Card>
      </ScrollView>
      <SaveFooter dirty={dirty} phase={phase} error={error} onSave={() => void save()} bottomInset={insets.bottom} />
    </Animated.View>
  )
}
