import type { SFSymbol } from 'expo-symbols'
import { Icon } from '@/ui/Icon'
import { LeadingCircle } from '@/ui/LeadingCircle'
import { ListGroup } from '@/ui/ListGroup'
import { ListRow } from '@/ui/ListRow'
import { Stagger } from '@/ui/Stagger'
import { useLatched } from '@/ui/useEntered'
import type { StageProps } from './stage'

type Row = { symbol: SFSymbol; title: string; subtitle: string }

const rows: Row[] = [
  { symbol: 'envelope', title: 'Code aus dem Brief', subtitle: 'Sechs Zeichen, verschickt von deiner Verwaltung' },
  { symbol: 'house', title: 'Deine Wohnung', subtitle: 'Haus, Etappe und Rochade-Wohnung sind hinterlegt' },
  { symbol: 'bell', title: 'Live-Updates', subtitle: 'Änderungen erscheinen sofort in der App' },
]

export const CodeStage = ({ active }: StageProps) => {
  const play = useLatched(active)
  return (
    <ListGroup>
      {rows.map((row, index) => (
        <Stagger key={row.title} index={index} step={90} play={play}>
          <ListRow
            title={row.title}
            subtitle={row.subtitle}
            leading={
              <LeadingCircle>
                <Icon name={row.symbol} size={18} />
              </LeadingCircle>
            }
          />
        </Stagger>
      ))}
    </ListGroup>
  )
}
