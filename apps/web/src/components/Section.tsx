import type { ReactNode } from 'react'

type Props = { title: string; aside?: ReactNode; children: ReactNode }

export const Section = ({ title, aside, children }: Props) => (
  <section className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-h2">{title}</h2>
      {aside}
    </div>
    {children}
  </section>
)
