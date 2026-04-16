import { LoginForm } from "@/features/auth/login-form";
import { redirectIfAuthenticated } from "@/lib/guards/redirect-authenticated";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[1.1fr_420px]">
        <section className="space-y-6 rounded-[2rem] border border-stone-200 bg-stone-950 p-8 text-stone-50 shadow-panel">
          <p className="w-fit rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-amber-300">
            Ngọc Châu
          </p>
          <div className="space-y-4">
            <h1 className="max-w-lg text-4xl font-semibold leading-tight">
              Giảm thao tác Excel thủ công cho cửa hàng vàng và tập trung vào vận hành mỗi ngày.
            </h1>
            <p className="max-w-2xl text-base text-stone-300">
              Đăng nhập để theo dõi giao dịch, thu chi, tồn kho, báo cáo và luồng import dữ liệu cũ từ Excel.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {["Dashboard owner", "Giao dịch hằng ngày", "Import Excel có kiểm tra"].map((item) => (
              <div key={item} className="rounded-2xl border border-stone-800 bg-stone-900 p-4 text-sm text-stone-300">
                {item}
              </div>
            ))}
          </div>
        </section>
        <section className="flex items-center justify-center">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}

