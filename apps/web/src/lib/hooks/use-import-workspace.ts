"use client";

import { useMemo, useState } from "react";

import { QUERY_KEYS } from "@gold-shop/constants";
import { useQuery } from "@tanstack/react-query";

import {
  buildImportScreenState,
  getImportPreviewRows,
  mapImportSummary,
  mapSessionValidationIssues
} from "@/lib/adapters/import-workspace";
import { httpClient } from "@/lib/api-client/http-client";

import type { ImportSession } from "@gold-shop/types";

export function useImportWorkspace() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [session, setSession] = useState<ImportSession | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const previewQuery = useQuery({
    queryKey: QUERY_KEYS.importPreview,
    queryFn: async () => getImportPreviewRows()
  });

  const hasWorkspaceContext = Boolean(selectedFile || session);
  const previewRows = session ? (previewQuery.data ?? []) : [];
  const issues = useMemo(() => (hasWorkspaceContext ? mapSessionValidationIssues(session) : []), [hasWorkspaceContext, session]);
  const summary = useMemo(
    () => (hasWorkspaceContext ? mapImportSummary(session, issues, previewRows) : mapImportSummary(null, [], [])),
    [hasWorkspaceContext, issues, previewRows, session]
  );
  const screenState = useMemo(
    () =>
      buildImportScreenState({
        hasFile: Boolean(selectedFile),
        session,
        isBusy,
        issues
      }),
    [isBusy, issues, selectedFile, session]
  );

  function onFileChange(file: File | null) {
    setSelectedFile(file);
    setSession(null);
    setErrorMessage(null);
    setServerMessage(file ? `Đã chọn tệp ${file.name}` : null);
  }

  async function handleUpload() {
    if (!selectedFile) {
      setErrorMessage("Vui lòng chọn tệp trước khi tải lên.");
      return;
    }

    setIsBusy(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadedSession = await httpClient.post<ImportSession>("/excel-import/upload", formData);
      setSession(uploadedSession);
      setServerMessage("Tệp đã được tải lên thành công. Tiếp tục bước kiểm tra dữ liệu.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể tải tệp lên lúc này.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleValidate() {
    if (!session) {
      return;
    }

    setIsBusy(true);
    setErrorMessage(null);

    try {
      const validatedSession = await httpClient.post<ImportSession>("/excel-import/validate", {
        sessionId: session.id
      });
      setSession(validatedSession);
      setServerMessage("Dữ liệu đã được kiểm tra. Xem lại bảng preview trước khi xác nhận.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể kiểm tra dữ liệu.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleCommit() {
    if (!session || !screenState.canCommit) {
      return;
    }

    setIsBusy(true);
    setErrorMessage(null);

    try {
      const committedSession = await httpClient.post<ImportSession>("/excel-import/commit", {
        sessionId: session.id
      });
      setSession(committedSession);
      setServerMessage("Phiên nhập đã được xác nhận. Có thể nối bước ghi dữ liệu thật sau này.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể xác nhận nhập dữ liệu.");
    } finally {
      setIsBusy(false);
    }
  }

  function handleDrop(files: FileList | null) {
    if (!files?.length) {
      return;
    }

    setIsDragActive(false);
    onFileChange(files[0]);
  }

  function dismissError() {
    setErrorMessage(null);
  }

  function resetWorkspace() {
    setSelectedFile(null);
    setSession(null);
    setErrorMessage(null);
    setServerMessage(null);
    setIsDragActive(false);
  }

  return {
    selectedFile,
    session,
    previewRows,
    issues,
    summary,
    screenState,
    isDragActive,
    errorMessage,
    serverMessage,
    setIsDragActive,
    onFileChange,
    handleDrop,
    handleUpload,
    handleValidate,
    handleCommit,
    dismissError,
    resetWorkspace
  };
}
