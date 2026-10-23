import type { Project } from '@rochade/shared'
import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'

type Props = { project?: Project; live?: boolean; lastChangeAt?: Date | null; children: ReactNode }

export const Page = ({ children, ...header }: Props) => (
  <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
    <Header {...header} />
    <main className="space-y-8">{children}</main>
    <Footer />
  </div>
)
