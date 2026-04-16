import { redirect } from "next/navigation";

import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function redirectIfAuthenticated(destination = "/dashboard") {
  const supabase = await getServerSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session) {
    redirect(destination);
  }
}

