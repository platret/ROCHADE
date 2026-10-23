import type { RochadeClient } from '@rochade/shared'
import { useProjectData } from '../hooks/useProjectData'
import { ErrorCard } from './ErrorCard'
import { LoadingSkeleton } from './LoadingSkeleton'
import { Page } from './Page'
import { ProjectView } from './ProjectView'

export const Dashboard = ({ client }: { client: RochadeClient }) => {
  const state = useProjectData(client)
  const data = state.status === 'ready' ? state.data : undefined
  return (
    <Page project={data?.project} live={Boolean(data)} lastChangeAt={state.lastChangeAt}>
      {state.status === 'loading' && <LoadingSkeleton />}
      {state.status === 'error' && <ErrorCard message={state.error} onRetry={state.reload} />}
      {data && <ProjectView client={client} data={data} />}
    </Page>
  )
}
