import { createClient } from '@supabase/supabase-js';

// Read Supabase credentials from environment variables (Vite requires VITE_ prefix)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseClient;
try {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
} catch (e) {
    console.error('Supabase initialization failed:', e);
    // Mock for now to allow app to boot
    supabaseClient = {
        auth: { onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }), getSession: async () => ({ data: { session: null } }) },
        from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }), order: () => ({ ascending: () => ({ data: [], error: null }) }) }) })
    };
}

export const supabase = supabaseClient;
