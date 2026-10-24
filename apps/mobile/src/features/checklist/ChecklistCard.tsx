import { todayIso } from '@rochade/shared'
import { Fragment } from 'react'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { Card } from '@/ui/Card'
import { AllDoneRow } from './AllDoneRow'
import { ChecklistHeader } from './ChecklistHeader'
import { ChecklistDivider, ChecklistRow } from './ChecklistRow'
import { isOverdue, type ChecklistItem } from './items'
import { useChecklist } from './useChecklist'

export type ChecklistCardProps = { householdId: string; items: ChecklistItem[] }

export const ChecklistCard = ({ householdId, items }: ChecklistCardProps) => {
  const { isDone, doneCount, complete, toggle, reset } = useChecklist(householdId, items)
  const today = todayIso()
  return (
    <Animated.View layout={LinearTransition.duration(250)}>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {complete ? (
          <AllDoneRow onReset={reset} />
        ) : (
          <>
            <ChecklistHeader done={doneCount} total={items.length} onReset={doneCount > 0 ? reset : undefined} />
            {items.map((item, index) => (
              <Fragment key={item.id}>
                {index > 0 && <ChecklistDivider />}
                <ChecklistRow item={item} done={isDone(item.id)} overdue={isOverdue(item, today)} onToggle={() => toggle(item.id)} />
              </Fragment>
            ))}
          </>
        )}
      </Card>
    </Animated.View>
  )
}
