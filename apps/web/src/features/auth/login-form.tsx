"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { ArrowRight, ShieldCheck } from "lucide-react";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@gold-shop/ui";
import type { LoginInput } from "@gold-shop/validation";
import { LoginSchema } from "@gold-shop/validation";

import type { LoginFormCopy } from "@/features/auth/login-screen.config";
import { StatusPill } from "@/components/common/status-pill";
import { BrandMark } from "@/components/layout/nav-icon";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";

interface LoginFormProps {
  copy: LoginFormCopy;
}

export function LoginForm({ copy }: LoginFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<LoginInput>({
    email: "",
    password: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof LoginInput, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = LoginSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dữ liệu đăng nhập không hợp lệ");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const supabase = getBrowserSupabaseClient();
    const { error: signInError } = await supabase.auth.signInWithPassword(parsed.data);

    if (signInError) {
      setError(signInError.message);
      setIsSubmitting(false);
      return;
    }

    startTransition(() => {
      router.replace("/dashboard");
      router.refresh();
    });
  }

  return (
    <Card className="w-full max-w-[460px] rounded-[36px] border-white/70 bg-white/95 shadow-[0px_24px_60px_-30px_rgba(26,28,29,0.35)] backdrop-blur-xl">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-brand-gradient text-white shadow-brand">
              <BrandMark className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-foreground-strong)]">Tiệm Vàng Ngọc Châu</p>
              <p className="text-xs text-[var(--color-foreground-muted)]">Phòng điều hành</p>
            </div>
          </div>
          <StatusPill label={copy.helperLabel} tone="info" className="hidden max-w-[180px] px-3 py-2 text-[11px] leading-4 md:inline-flex" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl tracking-[-0.04em]">{copy.title}</CardTitle>
          <CardDescription className="text-sm leading-6">{copy.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">{copy.emailLabel}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder={copy.emailPlaceholder}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="password">{copy.passwordLabel}</Label>
              <Link href="/forgot-password" className="text-sm font-medium text-[var(--color-brand-blue)]">
                {copy.forgotPasswordLabel}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder={copy.passwordPlaceholder}
            />
          </div>

          {error ? (
            <div className="flex items-start gap-3 rounded-[24px] bg-[var(--color-danger-bg)] px-4 py-3 text-sm text-[var(--color-danger-fg)]">
              <ShieldCheck className="mt-0.5 h-4 w-4" />
              <p className="leading-6">{error}</p>
            </div>
          ) : null}

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? copy.pendingLabel : copy.submitLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
