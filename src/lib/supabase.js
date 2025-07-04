import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://<PROJECT-ID>.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '<ANON_KEY>'

// Check if Supabase is properly configured
const isSupabaseConfigured = 
  SUPABASE_URL !== 'https://<PROJECT-ID>.supabase.co' && 
  SUPABASE_ANON_KEY !== '<ANON_KEY>' &&
  SUPABASE_URL && 
  SUPABASE_ANON_KEY;

export const supabase = isSupabaseConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

// Export configuration status
export const isConfigured = isSupabaseConfigured;

// Log configuration status
if (isSupabaseConfigured) {
  console.log('✅ Supabase configured successfully');
} else {
  console.warn('⚠️ Supabase not configured - using mock data');
}

export default supabase;