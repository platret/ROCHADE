import { createRochadeClient, type RochadeClient } from '@rochade/shared'

const url = process.env.EXPO_PUBLIC_SUPABASE_URL
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

export const supabase: RochadeClient | null = url && anonKey ? createRochadeClient(url, anonKey) : null
