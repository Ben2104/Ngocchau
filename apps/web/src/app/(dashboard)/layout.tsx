import { DashboardShell } from "@/components/layout/dashboard-shell";
import { buildCurrentUserProfile } from "@/lib/current-user";
import { requireAuthenticatedUser } from "@/lib/guards/require-auth";
import { CurrentUserProvider } from "@/providers/current-user-provider";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuthenticatedUser();
  const currentUser = buildCurrentUserProfile(user);

  return (
    <CurrentUserProvider value={currentUser}>
      <DashboardShell currentUser={currentUser}>{children}</DashboardShell>
    </CurrentUserProvider>
  );
}
