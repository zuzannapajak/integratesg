import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // We exchange OAuth/recovery codes manually in our callback pages.
      // Leaving automatic URL detection enabled can cause a second exchange
      // of the same PKCE code and surface as "exchange code failed".
      detectSessionInUrl: false,
    },
  });
}
