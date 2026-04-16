"use client";

import { useState } from "react";

import type { ImportSession } from "@gold-shop/types";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@gold-shop/ui";

import { PageHeader } from "@/components/common/page-header";
import { httpClient } from "@/lib/api-client/http-client";

export function ImportExcelPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [session, setSession] = useState<ImportSession | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload() {
    if (!file) {
      setError("Vui lòng chọn file Excel trước khi upload.");
      return;
    }

    setIsPending(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadSession = await httpClient.post<ImportSession>("/excel-import/upload", formData);
      setSession(uploadSession);
      setMessage("Upload thành công. Tiếp tục bước validate.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Không thể upload file");
    } finally {
      setIsPending(false);
    }
  }

  async function handleValidate() {
    if (!session) {
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      const validatedSession = await httpClient.post<ImportSession>("/excel-import/validate", {
        sessionId: session.id
      });
      setSession(validatedSession);
      setMessage("Đã validate file. Có thể commit khi kiểm tra xong.");
    } catch (validationError) {
      setError(validationError instanceof Error ? validationError.message : "Không thể validate file");
    } finally {
      setIsPending(false);
    }
  }

  async function handleCommit() {
    if (!session) {
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      const committedSession = await httpClient.post<ImportSession>("/excel-import/commit", {
        sessionId: session.id
      });
      setSession(committedSession);
      setMessage("Đã commit phiên import. Có thể tiếp tục nối logic insert dữ liệu thực tế.");
    } catch (commitError) {
      setError(commitError instanceof Error ? commitError.message : "Không thể commit import");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Excel import"
        title="Nhập dữ liệu từ file Excel"
        description="Luồng khởi tạo gồm upload lên Supabase Storage, validate trên API và commit theo phiên."
      />
      <Card>
        <CardHeader>
          <CardTitle>Upload file nguồn</CardTitle>
          <CardDescription>Phù hợp cho dữ liệu giao dịch hoặc tồn kho đang lưu bằng Excel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleUpload} disabled={isPending}>
              Upload
            </Button>
            <Button variant="outline" onClick={handleValidate} disabled={isPending || !session}>
              Validate
            </Button>
            <Button variant="secondary" onClick={handleCommit} disabled={isPending || !session}>
              Commit
            </Button>
          </div>
          {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {session ? (
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
              <p>Mã phiên: {session.id}</p>
              <p>Trạng thái: {session.status}</p>
              <p>Tệp: {session.fileName}</p>
              {session.validationSummary ? (
                <p>
                  Hợp lệ: {session.validationSummary.validRowCount} | Lỗi:{" "}
                  {session.validationSummary.invalidRowCount}
                </p>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

