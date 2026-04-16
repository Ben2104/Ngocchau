import { LoginForm } from "@/features/auth/login-form";
import { loginScreenCopy } from "@/features/auth/login-screen.config";
import { BrandMark } from "@/components/layout/nav-icon";
import { redirectIfAuthenticated } from "@/lib/guards/redirect-authenticated";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <main className="relative min-h-screen overflow-hidden bg-shell px-4 py-8 lg:px-10 lg:py-10">
      <div className="absolute left-[-10%] top-16 h-72 w-72 rounded-full bg-[rgba(212,175,55,0.18)] blur-3xl" />
      <div className="absolute bottom-10 right-[-6%] h-72 w-72 rounded-full bg-[rgba(38,86,173,0.14)] blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
        <section className="rounded-[40px] bg-[linear-gradient(145deg,#12304d_0%,#735c00_100%)] p-6 text-white shadow-[0px_24px_60px_-24px_rgba(18,48,77,0.45)] lg:min-h-[640px] lg:p-10">
          <div className="flex h-full flex-col justify-between gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-white/14">
                  <BrandMark className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">{loginScreenCopy.badgeLabel}</p>
                  <p className="mt-1 text-base font-semibold">Tiệm Vàng Ngọc Châu</p>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] lg:text-5xl">
                  {loginScreenCopy.heroTitle}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-white/78">{loginScreenCopy.heroDescription}</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/10 p-6 backdrop-blur-md">
              <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-[rgba(212,175,55,0.25)] blur-3xl" />
              <div className="relative grid gap-4">
                <div className="rounded-[28px] bg-white/92 p-6 text-stone-900">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-gold)]">Foundation ready</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                    UI shell, route config, service adapters và role guard đã tách riêng.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {loginScreenCopy.heroHighlights.map((item) => (
                    <div key={item.title} className="rounded-[28px] bg-white/12 p-5">
                      <p className="text-lg font-semibold">{item.title}</p>
                      <p className="mt-3 text-sm leading-6 text-white/72">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <LoginForm copy={loginScreenCopy.form} />
        </section>
      </div>
    </main>
  );
}
