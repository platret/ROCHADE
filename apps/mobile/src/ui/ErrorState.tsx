import { EmptyState } from './EmptyState'

export type ErrorStateProps = {
  retry: () => void
  retrying?: boolean
  title?: string
  body?: string
  detail?: string
}

export const ErrorState = ({
  retry,
  retrying,
  title = 'Daten konnten nicht geladen werden',
  body = 'Bitte prüfe die Internetverbindung und versuche es erneut.',
  detail,
}: ErrorStateProps) => (
  <EmptyState
    symbol="wifi.exclamationmark"
    title={title}
    body={body}
    detail={detail}
    action={{ label: 'Erneut versuchen', onPress: retry, loading: retrying }}
  />
)
