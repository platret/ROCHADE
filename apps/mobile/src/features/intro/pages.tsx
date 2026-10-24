import { tagline } from '@rochade/shared'
import type { ComponentType } from 'react'
import { CodeStage } from './CodeStage'
import { LiveStage } from './LiveStage'
import { RailStage } from './RailStage'
import type { StageProps } from './stage'
import { WelcomeStage } from './WelcomeStage'

export type IntroPageSpec = { title: string; body: string; Stage: ComponentType<StageProps> }

export const introPages: readonly IntroPageSpec[] = [
  {
    title: tagline,
    body: 'Wenn dein Haus saniert wird, zeigt dir ROCHADE, wann du wohin ziehst und wann du zurückkommst.',
    Stage: WelcomeStage,
  },
  {
    title: 'Dein Umzug auf einen Blick',
    body: 'Auszug, Rochade-Wohnung und Rückkehr stehen auf einer Linie, mit Datum, Haus und Stockwerk.',
    Stage: RailStage,
  },
  {
    title: 'Live informiert',
    body: 'Ändert die Verwaltung den Plan, siehst du es innerhalb einer Sekunde, mit dem genauen Grund.',
    Stage: LiveStage,
  },
  {
    title: 'Dein Code, dein Plan',
    body: 'Kein Konto, kein Passwort. Der Code aus dem Brief deiner Verwaltung öffnet deinen Plan.',
    Stage: CodeStage,
  },
]
