import { wordmark, type Project } from '@rochade/shared'
import { LiveIndicator } from './LiveIndicator'
import { LogoMark } from './LogoMark'

type Props = { project?: Project; live?: boolean; lastChangeAt?: Date | null }

export const Header = ({ project, live = false, lastChangeAt = null }: Props) => (
  <header className="flex flex-wrap items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <LogoMark />
      <span className="text-h2 font-extrabold tracking-wordmark">{wordmark.text}</span>
    </div>
    <div className="flex flex-wrap items-center gap-4">
      {project && (
        <span className="text-body-sm text-ink-muted">
          {project.name} · {project.city}
        </span>
      )}
      <LiveIndicator live={live} lastChangeAt={lastChangeAt} />
    </div>
  </header>
)
