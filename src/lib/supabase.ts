import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only throw error on client-side or during runtime, not at build time
let supabaseClient: any = null;

export function getSupabase() {
  if (typeof window === "undefined") {
    // Server-side
    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase environment variables not set");
      return null;
    }
  }

  if (!supabaseClient && supabaseUrl && supabaseKey) {
    supabaseClient = createSupabaseClient(supabaseUrl, supabaseKey);
  }

  return supabaseClient;
}

// Export the createClient function
export function createClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables not set");
  }
  return createSupabaseClient(supabaseUrl, supabaseKey);
}

// Legacy export for backward compatibility
export const supabase = getSupabase();
