import { radius, spacing, typeScale } from '@rochade/shared'
import { useState, type ComponentRef, type Ref } from 'react'
import { TextInput, View, type TextInputProps } from 'react-native'
import { fontFamilyFor } from '@/theme/fonts'
import { useTheme } from '@/theme/useTheme'
import { Text } from '@/ui/Text'

type InputProps = Pick<
  TextInputProps,
  'value' | 'onChangeText' | 'placeholder' | 'maxLength' | 'multiline' | 'autoCapitalize' | 'autoCorrect' | 'returnKeyType' | 'onSubmitEditing' | 'editable'
>

export type FieldHandle = ComponentRef<typeof TextInput>

export type FieldProps = InputProps & {
  label: string
  optional?: boolean
  helper?: string
  counter?: boolean
  ref?: Ref<FieldHandle>
}

export const Field = ({ label, optional = false, helper, counter = false, ref, multiline = false, value = '', maxLength, ...input }: FieldProps) => {
  const { colors } = useTheme()
  const [focused, setFocused] = useState(false)
  return (
    <View style={{ gap: spacing.sm }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text variant="label" color="inkMuted">
          {label}
        </Text>
        {optional && (
          <Text variant="label" weight={400} color="inkMuted">
            Optional
          </Text>
        )}
      </View>
      <TextInput
        ref={ref}
        {...input}
        value={value}
        maxLength={maxLength}
        multiline={multiline}
        accessibilityLabel={label}
        placeholderTextColor={colors.inkMuted}
        maxFontSizeMultiplier={1.6}
        clearButtonMode={multiline ? 'never' : 'while-editing'}
        textAlignVertical="top"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          fontFamily: fontFamilyFor(400),
          fontSize: typeScale.body.size,
          color: colors.ink,
          backgroundColor: colors.surfaceSunken,
          borderWidth: 1,
          borderColor: focused ? colors.ink : colors.lineStrong,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          minHeight: multiline ? 120 : 48,
          maxHeight: multiline ? 200 : undefined,
        }}
      />
      {helper && (
        <Text variant="bodySm" color="inkMuted">
          {helper}
        </Text>
      )}
      {counter && maxLength !== undefined && (
        <Text variant="caption" color="inkMuted" align="right">
          {`${value.length}/${maxLength}`}
        </Text>
      )}
    </View>
  )
}
