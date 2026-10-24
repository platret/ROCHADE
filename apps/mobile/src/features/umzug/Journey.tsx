import { formatDate, todayIso, type Assignment, type Flat } from '@rochade/shared'
import type { AssignmentChange, ChangeField } from '@/data/assignmentChanges'
import { Card } from '@/ui/Card'
import { Text } from '@/ui/Text'
import { latestChangeAt } from './changes'
import { countdown, currentStep, nodeState } from './steps'
import { JourneyStep } from './JourneyStep'
import { DateHero, FlatChips, FlatHero, flatPlace, ReturnLine } from './stepContent'

export type JourneyProps = {
  assignment: Assignment
  tempFlat: Flat | null
  homeFlat: Flat | null
  changes: AssignmentChange[]
}

const dateFallback = 'Termin folgt'

export const Journey = ({ assignment, tempFlat, homeFlat, changes }: JourneyProps) => {
  const { move_out, move_back, status } = assignment
  const today = todayIso()
  const current = currentStep(assignment, today)
  const conflict = status === 'conflict'
  const flatFallback = conflict ? 'Noch offen' : 'Wohnung folgt'
  const stateOf = (index: number) => nodeState(index, current, conflict)
  const flashKeyOf = (field: ChangeField) => latestChangeAt(changes, field)?.getTime() ?? null
  const moveOutDetail = move_out ? `${formatDate(move_out)}, ${countdown(today, move_out)}` : dateFallback
  const flatDetail = tempFlat ? `${tempFlat.label}, ${flatPlace(tempFlat)}` : flatFallback
  const moveBackDetail = move_back ? `${formatDate(move_back)}, zurück in ${homeFlat?.label ?? 'deine Wohnung'}` : dateFallback
  return (
    <Card style={{ padding: 0 }}>
      <JourneyStep
        index={0}
        title="Auszug"
        state={stateOf(0)}
        flashKey={flashKeyOf('move_out')}
        hero={<DateHero date={move_out} fallback={dateFallback} />}
        detail={moveOutDetail}
      >
        {move_out !== null && <Text color="inkMuted">{countdown(today, move_out)}</Text>}
      </JourneyStep>
      <JourneyStep
        index={1}
        title="Rochade-Wohnung"
        state={stateOf(1)}
        flashKey={flashKeyOf('temp_flat_id')}
        hero={
          tempFlat ? (
            <FlatHero flat={tempFlat} />
          ) : (
            <Text weight={600} color="inkMuted">
              {flatFallback}
            </Text>
          )
        }
        detail={flatDetail}
      >
        {tempFlat && (
          <>
            <Text color="inkMuted">{flatPlace(tempFlat)}</Text>
            <FlatChips flat={tempFlat} />
          </>
        )}
      </JourneyStep>
      <JourneyStep
        index={2}
        title="Rückkehr"
        state={stateOf(2)}
        flashKey={flashKeyOf('move_back')}
        hero={<DateHero date={move_back} fallback={dateFallback} />}
        detail={moveBackDetail}
      >
        <ReturnLine homeFlat={homeFlat} />
      </JourneyStep>
    </Card>
  )
}
