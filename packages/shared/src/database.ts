import type { Assignment, Flat, Household, Phase, Project } from './types'

type Table<Row, Optional extends keyof Row> = {
  Row: Row
  Insert: Omit<Row, Optional> & Partial<Pick<Row, Optional>>
  Update: Partial<Row>
  Relationships: []
}

export type Database = {
  __InternalSupabase: { PostgrestVersion: '13' }
  public: {
    Tables: {
      projects: Table<Project, 'id' | 'created_at'>
      phases: Table<Phase, 'id' | 'created_at' | 'sort_order'>
      flats: Table<Flat, 'id' | 'created_at' | 'floor' | 'step_free' | 'is_temporary' | 'school_district'>
      households: Table<Household, 'id' | 'created_at' | 'members' | 'home_flat_id' | 'needs_rooms' | 'needs_step_free' | 'school_district' | 'note'>
      assignments: Table<Assignment, 'id' | 'created_at' | 'updated_at' | 'temp_flat_id' | 'move_out' | 'move_back' | 'status' | 'conflict_reason'>
    }
    Views: { [name: string]: never }
    Functions: { [name: string]: never }
  }
}
