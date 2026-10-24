import { spacing, typeScale, wordmark, type RochadeClient } from '@rochade/shared'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'
import { Button } from '@/ui/Button'
import { riseIn } from '@/ui/entering'
import { Logo } from '@/ui/Logo'
import { Text } from '@/ui/Text'
import { useEntered } from '@/ui/useEntered'
import { CodeError } from './CodeError'
import { CodeFooter } from './CodeFooter'
import { CodeInput } from './CodeInput'
import { useCodeSignIn } from './useCodeSignIn'

export type CodeFormProps = { client: RochadeClient }

const delays = { brand: 0, title: 60, body: 100, input: 150, button: 200, footer: 320 } as const

const Brand = () => (
  <View
    accessible
    accessibilityRole="image"
    accessibilityLabel={wordmark.text}
    style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}
  >
    <Logo size={28} color="ink" />
    <Text variant="label" color="inkMuted" style={{ letterSpacing: typeScale.label.size * wordmark.letterSpacingEm }}>
      {wordmark.text}
    </Text>
  </View>
)

export const CodeForm = ({ client }: CodeFormProps) => {
  const entered = useEntered()
  const { code, setCode, complete, status, submit } = useCodeSignIn(client)
  if (!entered) return null
  return (
    <>
      <Animated.View entering={riseIn(delays.brand)}>
        <Brand />
      </Animated.View>
      <Animated.View entering={riseIn(delays.title)}>
        <Text variant="h1" accessibilityRole="header" style={{ marginTop: spacing.xxl }}>
          Zugangscode
        </Text>
      </Animated.View>
      <Animated.View entering={riseIn(delays.body)}>
        <Text color="inkMuted" style={{ marginTop: spacing.sm }}>
          Du findest deinen Code im Brief deiner Verwaltung.
        </Text>
      </Animated.View>
      <Animated.View entering={riseIn(delays.input)} style={{ marginTop: spacing.xl }}>
        <CodeInput value={code} onChange={setCode} onSubmit={submit} disabled={status.kind === 'loading'} />
      </Animated.View>
      {status.kind === 'error' && (
        <View style={{ marginTop: spacing.lg }}>
          <CodeError message={status.message} />
        </View>
      )}
      <Animated.View entering={riseIn(delays.button)} style={{ marginTop: spacing.lg }}>
        <Button label="Anmelden" onPress={submit} disabled={!complete} loading={status.kind === 'loading'} />
      </Animated.View>
      <CodeFooter delay={delays.footer} />
    </>
  )
}
