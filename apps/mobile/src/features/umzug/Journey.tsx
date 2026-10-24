import { todayIso, type Assignment, type Flat } from '@rochade/shared'
import { router } from 'expo-router'
import type { AssignmentChange, ChangeField } from '@/data/assignmentChanges'
import { Card } from '@/ui/Card'
import { Text } from '@/ui/Text'
import { latestChangeAt } from './changes'
import { currentStep, nextDateStep, nodeState } from './steps'
import { DateStep } from './DateStep'
import { JourneyStep } from './JourneyStep'
import { FlatChips, FlatHero, flatPlace, ReturnLine } from './stepContent'

export type JourneyProps = {
  assignment: Assignment
  tempFlat: Flat | null
  homeFlat: Flat | null
  changes: AssignmentChange[]
  delay?: number
}

const openWohnung = () => router.push('/wohnung')

export const Journey = ({ assignment, tempFlat, homeFlat, changes, delay = 0 }: JourneyProps) => {
  const { move_out, move_back, status } = assignment
  const today = todayIso()
  const current = currentStep(assignment, today)
  const nextStep = nextDateStep(current)
  const conflict = status === 'conflict'
  const flatFallback = conflict ? 'Noch offen' : 'Wohnung folgt'
  const stateOf = (index: number) => nodeState(index, current, conflict)
  const flashKeyOf = (field: ChangeField) => latestChangeAt(changes, field)?.getTime() ?? null
  const flatDetail = tempFlat ? `${tempFlat.label}, ${flatPlace(tempFlat)}` : flatFallback
  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <DateStep
        index={0}
        title="Auszug"
        date={move_out}
        today={today}
        state={stateOf(0)}
        current={current}
        delay={delay}
        flashKey={flashKeyOf('move_out')}
        next={nextStep === 0}
      />
      <JourneyStep
        index={1}
        title="Rochade-Wohnung"
        state={stateOf(1)}
        current={current}
        delay={delay}
        flashKey={flashKeyOf('temp_flat_id')}
        onPress={tempFlat ? openWohnung : undefined}
        accessibilityHint="Öffnet Details, Kalendereintrag und Teilen"
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
      <DateStep
        index={2}
        title="Rückkehr"
        date={move_back}
        today={today}
        state={stateOf(2)}
        current={current}
        delay={delay}
        flashKey={flashKeyOf('move_back')}
        next={nextStep === 2}
        note={`zurück in ${homeFlat?.label ?? 'deine Wohnung'}`}
      >
        <ReturnLine homeFlat={homeFlat} />
      </DateStep>
    </Card>
  )
}
