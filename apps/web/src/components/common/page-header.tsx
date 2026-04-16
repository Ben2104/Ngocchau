import { Badge } from "@gold-shop/ui";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      {eyebrow ? <Badge className="w-fit">{eyebrow}</Badge> : null}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950">{title}</h1>
        <p className="max-w-3xl text-sm text-stone-600">{description}</p>
      </div>
    </div>
  );
}

