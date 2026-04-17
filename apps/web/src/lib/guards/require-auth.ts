import { redirect } from "next/navigation";

import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function requireAuthenticatedSession() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireAuthenticatedUser() {
  return (await requireAuthenticatedSession()).user;
}
