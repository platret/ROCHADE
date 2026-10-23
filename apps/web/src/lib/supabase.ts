import { createRochadeClient, type RochadeClient } from '@rochade/shared'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase: RochadeClient | null = url && anonKey ? createRochadeClient(url, anonKey) : null
