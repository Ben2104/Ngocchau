import { createBrowserClient } from "@supabase/ssr";

import { publicEnv } from "@/lib/utils/env";

let supabaseBrowserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getBrowserSupabaseClient() {
  if (!supabaseBrowserClient) {
    supabaseBrowserClient = createBrowserClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey);
  }

  return supabaseBrowserClient;
}

