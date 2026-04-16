"use client";

import { createContext, useContext } from "react";

import type { CurrentUserProfile } from "@/lib/current-user";

const CurrentUserContext = createContext<CurrentUserProfile | null>(null);

export function CurrentUserProvider({
  children,
  value
}: {
  children: React.ReactNode;
  value: CurrentUserProfile;
}) {
  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUser() {
  const currentUser = useContext(CurrentUserContext);

  if (!currentUser) {
    throw new Error("useCurrentUser must be used within CurrentUserProvider");
  }

  return currentUser;
}
