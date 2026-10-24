import { useLocalSearchParams } from 'expo-router'
import { ProjectContent } from '@/data/ProjectContent'
import { TopScreen } from '@/ui/TopScreen'
import { identityFromParams, type WelcomeParams } from './route'
import { WelcomeBody } from './WelcomeBody'
import { WelcomeSkeleton } from './WelcomeSkeleton'

export const WelcomeScreen = () => {
  const params = useLocalSearchParams<WelcomeParams>()
  const identity = identityFromParams(params)
  return (
    <TopScreen contentStyle={{ flexGrow: 1 }}>
      <ProjectContent skeleton={<WelcomeSkeleton />} errorTitle="Angaben konnten nicht geladen werden">
        {(data) => <WelcomeBody data={data} identity={identity} />}
      </ProjectContent>
    </TopScreen>
  )
}
