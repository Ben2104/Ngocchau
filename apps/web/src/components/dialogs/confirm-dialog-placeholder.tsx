import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gold-shop/ui";

export function ConfirmDialogPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dialog hành động</CardTitle>
        <CardDescription>Giữ chỗ cho dialog xác nhận xóa, hoàn tác hoặc commit nghiệp vụ.</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-3">
        <Button variant="outline">Huỷ</Button>
        <Button>Xác nhận</Button>
      </CardContent>
    </Card>
  );
}

