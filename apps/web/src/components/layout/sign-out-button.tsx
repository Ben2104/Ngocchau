"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@gold-shop/ui";

import { getBrowserSupabaseClient } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSignOut() {
    setIsPending(true);
    const supabase = getBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={handleSignOut} disabled={isPending}>
      {isPending ? "Đang đăng xuất..." : "Đăng xuất"}
    </Button>
  );
}

