import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireAuthenticatedUser } from "@/lib/guards/require-auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuthenticatedUser();

  return <DashboardShell userEmail={user.email}>{children}</DashboardShell>;
}

