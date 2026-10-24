import { useState } from 'react'
import { haptics } from '@/lib/haptics'
import { Icon } from '@/ui/Icon'
import { Tactile } from '@/ui/Tactile'
import { Text } from '@/ui/Text'
import { ProfilRow } from './ProfilRow'

export type CodeRowProps = { code: string | null }

const label = 'Zugangscode'
const symbol = 'envelope'
const shownChars = 2
const tracking = 2
const toggleSize = 44

const masked = (code: string) => `${'•'.repeat(Math.max(0, code.length - shownChars))}${code.slice(-shownChars)}`

const spelled = (code: string) => code.split('').join(' ')

export const CodeRow = ({ code }: CodeRowProps) => {
  const [revealed, setRevealed] = useState(false)
  if (code === null) return <ProfilRow symbol={symbol} label={label} value="–" spoken="nicht vorhanden" muted />
  const toggle = () => {
    haptics.selection()
    setRevealed(!revealed)
  }
  return (
    <ProfilRow
      symbol={symbol}
      label={label}
      value={
        <Text variant="mono" style={{ letterSpacing: tracking }}>
          {revealed ? code : masked(code)}
        </Text>
      }
      spoken={revealed ? spelled(code) : `verborgen, endet auf ${spelled(code.slice(-shownChars))}`}
      trailing={
        <Tactile
          onPress={toggle}
          scale={0.92}
          accessibilityRole="button"
          accessibilityLabel={revealed ? 'Zugangscode verbergen' : 'Zugangscode anzeigen'}
          style={{ width: toggleSize, height: toggleSize, borderRadius: toggleSize / 2, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name={revealed ? 'eye.slash' : 'eye'} size={20} color="inkMuted" />
        </Tactile>
      }
    />
  )
}
