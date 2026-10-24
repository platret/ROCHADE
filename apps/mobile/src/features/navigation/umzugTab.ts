import type { Identity } from '@/lib/identity'

export const isVerwaltung = (identity: Identity | null) => identity?.kind === 'verwaltung'

export const umzugTabTitle = (identity: Identity | null) => (isVerwaltung(identity) ? 'Übersicht' : 'Mein Umzug')
