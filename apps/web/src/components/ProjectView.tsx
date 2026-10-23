import type { ProjectData, RochadeClient } from '@rochade/shared'
import { usePlan } from '../hooks/usePlan'
import { AssignmentSection } from './AssignmentSection'
import { PhaseSection } from './PhaseSection'

type Props = { client: RochadeClient; data: ProjectData }

export const ProjectView = ({ client, data }: Props) => {
  const plan = usePlan(client, data.project.id)
  return (
    <>
      <PhaseSection phases={data.phases} plan={plan} />
      <AssignmentSection data={data} />
    </>
  )
}
