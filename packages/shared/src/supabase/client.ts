import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../database'

export type RochadeClient = SupabaseClient<Database>

export const createRochadeClient = (url: string, anonKey: string): RochadeClient =>
  createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
