import { createClient } from '@supabase/supabase-js'

// Direct configuration (since .env is not available in AI Studio)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

/**
* Robust check for Supabase configuration.
*/
export const isSupabaseConfigured = (): boolean => {
  return (
    typeof SUPABASE_URL === 'string' &&
    SUPABASE_URL.startsWith('https://') &&
    typeof SUPABASE_ANON_KEY === 'string' &&
    SUPABASE_ANON_KEY.length > 20
  );
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      Prefer: 'return=minimal',
    },
  },
});

// אופציונלי לדיבאג
if (typeof window !== 'undefined') {
  (window as any).supabase = supabase;
}



// Logging
if (isSupabaseConfigured()) {
  console.log('StudioPlay: Supabase connection initialized.');
} else {
  console.warn('StudioPlay: Running in local-only mode (Missing Supabase Credentials).');
}