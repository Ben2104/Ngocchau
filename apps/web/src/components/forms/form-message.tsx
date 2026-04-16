interface FormMessageProps {
  tone?: "default" | "error" | "success";
  children: React.ReactNode;
}

export function FormMessage({ tone = "default", children }: FormMessageProps) {
  const className =
    tone === "error"
      ? "text-red-600"
      : tone === "success"
        ? "text-emerald-700"
        : "text-stone-500";

  return <p className={`text-sm ${className}`}>{children}</p>;
}

