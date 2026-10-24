import { radius, spacing } from '@rochade/shared'
import { useState } from 'react'
import { TextInput, View } from 'react-native'
import { monoFontFamily } from '@/theme/fonts'
import { useTheme } from '@/theme/useTheme'
import { codeLength } from './code'

export type CodeInputProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

const fontSize = 24
const letterSpacing = 6
const inputHeight = 60

export const CodeInput = ({ value, onChange, onSubmit, disabled = false }: CodeInputProps) => {
  const { colors } = useTheme()
  const [focused, setFocused] = useState(false)
  const borderWidth = focused ? 2 : 1
  return (
    <View style={{ padding: 2 - borderWidth }}>
      <TextInput
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        editable={!disabled}
        autoFocus
        maxLength={codeLength}
        autoCapitalize="characters"
        autoCorrect={false}
        spellCheck={false}
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        returnKeyType="done"
        placeholder="······"
        placeholderTextColor={colors.lineStrong}
        selectionColor={colors.orangeStrong}
        accessibilityLabel="Zugangscode, sechs Zeichen"
        accessibilityHint="Buchstaben und Ziffern aus dem Brief deiner Verwaltung"
        maxFontSizeMultiplier={1.3}
        style={{
          height: inputHeight,
          fontFamily: monoFontFamily,
          fontSize,
          letterSpacing,
          textAlign: 'center',
          color: colors.ink,
          backgroundColor: colors.surfaceSunken,
          borderWidth,
          borderColor: focused ? colors.orangeStrong : colors.lineStrong,
          borderRadius: radius.md,
          paddingLeft: spacing.lg + letterSpacing,
          paddingRight: spacing.lg,
        }}
      />
    </View>
  )
}
