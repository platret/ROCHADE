import type { Flat, Household, Phase, Project } from '../types'

const createdAt = '2026-10-24T00:00:00+00:00'
const projectId = 'a0000000-0000-4000-8000-000000000001'
const phaseId = (n: number) => `b0000000-0000-4000-8000-${String(n).padStart(12, '0')}`
const flatId = (n: number) => `c0000000-0000-4000-8000-${String(n).padStart(12, '0')}`
const householdId = (n: number) => `d0000000-0000-4000-8000-${String(n).padStart(12, '0')}`

export const demoProject: Project = {
  id: projectId,
  name: 'Siedlung Sonnenhalde',
  city: 'Zürich',
  created_at: createdAt,
}

const phase = (n: number, name: string, building: string, start_date: string, end_date: string): Phase => ({
  id: phaseId(n),
  project_id: projectId,
  name,
  building,
  start_date,
  end_date,
  sort_order: n,
  created_at: createdAt,
})

export const demoPhases: Phase[] = [
  phase(1, 'Etappe 1', 'Haus A', '2027-03-01', '2027-05-31'),
  phase(2, 'Etappe 2', 'Haus B', '2027-06-01', '2027-09-12'),
  phase(3, 'Etappe 3', 'Haus C', '2027-09-01', '2027-11-30'),
]

type FlatSpec = [n: number, label: string, building: string, floor: number, rooms: number, step_free: boolean, is_temporary: boolean, school_district: string]

const flat = ([n, label, building, floor, rooms, step_free, is_temporary, school_district]: FlatSpec): Flat => ({
  id: flatId(n),
  project_id: projectId,
  label,
  building,
  floor,
  rooms,
  step_free,
  is_temporary,
  school_district,
  created_at: createdAt,
})

export const demoFlats: Flat[] = (
  [
    [1, 'Whg. A.01', 'Haus A', 0, 2.5, true, false, 'Waidberg'],
    [2, 'Whg. A.12', 'Haus A', 1, 2.5, false, false, 'Waidberg'],
    [3, 'Whg. A.21', 'Haus A', 2, 4.5, false, false, 'Waidberg'],
    [4, 'Whg. A.22', 'Haus A', 2, 3.5, false, false, 'Waidberg'],
    [5, 'Whg. A.31', 'Haus A', 3, 4.5, false, false, 'Waidberg'],
    [6, 'Whg. B.01', 'Haus B', 0, 2.5, true, false, 'Waidberg'],
    [7, 'Whg. B.02', 'Haus B', 0, 3.5, true, false, 'Waidberg'],
    [8, 'Whg. B.21', 'Haus B', 2, 4.5, false, false, 'Waidberg'],
    [9, 'Whg. C.01', 'Haus C', 0, 2.5, true, false, 'Waidberg'],
    [10, 'Whg. C.11', 'Haus C', 1, 2.5, false, false, 'Waidberg'],
    [11, 'Whg. C.22', 'Haus C', 2, 3.5, false, false, 'Waidberg'],
    [12, 'Whg. D.01', 'Haus D', 0, 2.5, true, true, 'Waidberg'],
    [13, 'Whg. D.02', 'Haus D', 0, 3.5, true, true, 'Waidberg'],
    [14, 'Whg. D.11', 'Haus D', 1, 4.5, false, true, 'Waidberg'],
    [15, 'Whg. E.11', 'Haus E', 1, 2.5, false, true, 'Limmattal'],
    [16, 'Whg. E.21', 'Haus E', 2, 3.5, false, true, 'Limmattal'],
  ] satisfies FlatSpec[]
).map(flat)

type HouseholdSpec = [n: number, name: string, members: number, homeFlat: number, needs_rooms: number, needs_step_free: boolean, school_district: string | null, note: string | null]

const household = ([n, name, members, homeFlat, needs_rooms, needs_step_free, school_district, note]: HouseholdSpec): Household => ({
  id: householdId(n),
  project_id: projectId,
  name,
  members,
  home_flat_id: flatId(homeFlat),
  needs_rooms,
  needs_step_free,
  school_district,
  note,
  created_at: createdAt,
})

export const demoHouseholds: Household[] = (
  [
    [1, 'Familie Keller', 4, 3, 3.5, false, 'Waidberg', 'Zwei Kinder im Schulhaus Waidberg, der Schulweg soll gleich bleiben.'],
    [2, 'Frau Schmid', 1, 1, 2, false, null, null],
    [3, 'Familie Bianchi', 3, 4, 3.5, false, 'Waidberg', null],
    [4, 'Herr Zimmermann', 1, 2, 2, false, null, 'Arbeitet im Homeoffice.'],
    [5, 'Familie Kaya', 5, 5, 4.5, false, 'Waidberg', 'Drei Kinder, grosse Wohnung nötig.'],
    [6, 'Frau Meier', 1, 6, 2, true, null, '78 Jahre, geht am Rollator. Keine Treppen möglich.'],
    [7, 'Herr und Frau Aeschbacher', 2, 7, 2.5, true, null, 'Herr Aeschbacher ist auf den Rollstuhl angewiesen.'],
    [8, 'Familie Oliveira', 4, 8, 3.5, false, 'Waidberg', null],
    [9, 'Herr Brunner', 1, 9, 2, true, null, 'Gehbehinderung. Braucht hindernisfreien Zugang und ein Arbeitszimmer.'],
    [10, 'Frau Gerber', 1, 10, 2, false, null, null],
    [11, 'Familie Steiner', 3, 11, 3.5, false, 'Waidberg', null],
  ] satisfies HouseholdSpec[]
).map(household)

export const demoIds = {
  project: projectId,
  phase3: phaseId(3),
  brunner: householdId(9),
  meier: householdId(6),
  keller: householdId(1),
  flatD01: flatId(12),
} as const
