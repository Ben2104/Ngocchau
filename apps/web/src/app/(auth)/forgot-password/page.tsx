import Link from "next/link";

import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";
import { redirectIfAuthenticated } from "@/lib/guards/redirect-authenticated";

export default async function ForgotPasswordPage() {
  await redirectIfAuthenticated();

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="space-y-6">
        <ForgotPasswordForm />
        <div className="text-center text-sm text-stone-600">
          <Link href="/login" className="font-medium text-amber-700 hover:text-amber-800">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </main>
  );
}

