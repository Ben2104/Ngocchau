import { redirect } from "next/navigation";

import { getServerSupabaseClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  redirect(session ? "/dashboard" : "/login");
}

