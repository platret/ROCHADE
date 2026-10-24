export type UUID = string
export type ISODate = string

export const assignmentStatuses = ['ok', 'conflict', 'open'] as const
export type AssignmentStatus = (typeof assignmentStatuses)[number]

export type Project = {
  id: UUID
  name: string
  city: string
  admin_code: string | null
  created_at: string
}

export type Phase = {
  id: UUID
  project_id: UUID
  name: string
  building: string
  start_date: ISODate
  end_date: ISODate
  sort_order: number
  created_at: string
}

export type Flat = {
  id: UUID
  project_id: UUID
  label: string
  building: string
  floor: number
  rooms: number
  step_free: boolean
  is_temporary: boolean
  school_district: string | null
  created_at: string
}

export type Household = {
  id: UUID
  project_id: UUID
  name: string
  members: number
  home_flat_id: UUID | null
  needs_rooms: number
  needs_step_free: boolean
  school_district: string | null
  note: string | null
  invite_code: string | null
  created_at: string
}

export type Assignment = {
  id: UUID
  project_id: UUID
  household_id: UUID
  temp_flat_id: UUID | null
  move_out: ISODate | null
  move_back: ISODate | null
  status: AssignmentStatus
  conflict_reason: string | null
  created_at: string
  updated_at: string
}

export type Period = {
  start: ISODate
  end: ISODate
}
