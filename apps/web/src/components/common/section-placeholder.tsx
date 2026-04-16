import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gold-shop/ui";

import { PageHeader } from "@/components/common/page-header";

interface SectionPlaceholderProps {
  title: string;
  description: string;
  checklist: string[];
}

export function SectionPlaceholder({ title, description, checklist }: SectionPlaceholderProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} eyebrow="Starter module" />
      <Card>
        <CardHeader>
          <CardTitle>Sẵn sàng mở rộng</CardTitle>
          <CardDescription>
            Màn hình này đã có route, guard, layout và contract để nối tiếp nghiệp vụ.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-stone-600">
            {checklist.map((item) => (
              <li key={item} className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

