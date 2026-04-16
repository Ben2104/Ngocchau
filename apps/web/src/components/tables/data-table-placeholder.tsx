import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gold-shop/ui";

export function DataTablePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-stone-500">
        Bảng dữ liệu sẽ được nối tiếp tại đây khi module nghiệp vụ được triển khai sâu hơn.
      </CardContent>
    </Card>
  );
}

