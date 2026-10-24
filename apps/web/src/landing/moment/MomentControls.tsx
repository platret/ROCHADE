import { Pause, Play } from 'lucide-react'
import { cx } from '../../lib/cx'

type PauseProps = { paused: boolean; onToggle: () => void }
type ToggleProps = { after: boolean; onChange: (after: boolean) => void }

const iconButton =
  'grid size-8 place-items-center rounded-sm text-ink hover:bg-surface-sunken outline-orange-strong focus-visible:outline-2 focus-visible:outline-offset-2'

export const PauseButton = ({ paused, onToggle }: PauseProps) => (
  <button type="button" onClick={onToggle} aria-pressed={paused} aria-label={paused ? 'Animation abspielen' : 'Animation anhalten'} className={iconButton}>
    {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
  </button>
)

export const BeforeAfterToggle = ({ after, onChange }: ToggleProps) => (
  <div className="flex rounded-sm border border-line p-0.5" role="group" aria-label="Zustand wählen">
    {[
      { value: false, label: 'Vorher' },
      { value: true, label: 'Nachher' },
    ].map((option) => (
      <button
        key={option.label}
        type="button"
        aria-pressed={after === option.value}
        onClick={() => onChange(option.value)}
        className={cx('rounded-sm px-2 py-1 text-label', after === option.value ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink')}
      >
        {option.label}
      </button>
    ))}
  </div>
)
