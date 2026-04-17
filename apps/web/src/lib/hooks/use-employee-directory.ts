"use client";

import { useDeferredValue, useState } from "react";

import { APP_ERROR_CODES, EMPLOYEE_DIRECTORY_PAGE_SIZE, QUERY_KEYS } from "@gold-shop/constants";
import type { AppRole, EmployeeAssignableRole, EmployeeListItem, EmployeeListParams } from "@gold-shop/types";
import { EmployeeCreateSchema } from "@gold-shop/validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiRequestError } from "@/lib/api-client/http-client";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeDirectory
} from "@/lib/services/employee-directory-service";
import { useCurrentUser } from "@/providers/current-user-provider";

const defaultParams: EmployeeListParams = {
  page: 1,
  pageSize: EMPLOYEE_DIRECTORY_PAGE_SIZE,
  search: "",
  sortBy: "joinedAt",
  sortDirection: "desc",
  role: "all"
};

const defaultCreateForm = {
  fullName: "",
  email: "",
  role: "staff" as EmployeeAssignableRole,
  password: "",
  confirmPassword: ""
};

function resolveErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message.trim() !== "" ? error.message : fallback;
}

type EmployeeSetupIssue = {
  code: string;
  message: string;
};

function resolveSetupIssue(error: unknown): EmployeeSetupIssue | null {
  if (!(error instanceof ApiRequestError) || !error.code) {
    return null;
  }

  if (
    error.code !== APP_ERROR_CODES.employeeProfileTableMissing &&
    error.code !== APP_ERROR_CODES.auditLogTableMissing
  ) {
    return null;
  }

  return {
    code: error.code,
    message: error.message
  };
}

export function useEmployeeDirectory() {
  const currentUser = useCurrentUser();
  const queryClient = useQueryClient();
  const [params, setParams] = useState<EmployeeListParams>(defaultParams);
  const [isCreateFormOpen, setCreateFormOpen] = useState(false);
  const [createForm, setCreateForm] = useState(defaultCreateForm);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(params.search ?? "");
  const queryParams = {
    ...params,
    search: deferredSearch
  };

  const directoryQuery = useQuery({
    queryKey: [...QUERY_KEYS.employees, queryParams, currentUser.role],
    queryFn: () => getEmployeeDirectory(queryParams)
  });

  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: async (employee) => {
      setFeedback({
        tone: "success",
        message: `Đã tạo tài khoản cho ${employee.profile.fullName}.`
      });
      setCreateForm(defaultCreateForm);
      setCreateFormOpen(false);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees });
    },
    onError: (error) => {
      if (resolveSetupIssue(error)) {
        setFeedback(null);
        return;
      }

      setFeedback({
        tone: "error",
        message: resolveErrorMessage(error, "Không thể tạo tài khoản nhân viên")
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: async () => {
      setFeedback({
        tone: "success",
        message: "Đã xóa tài khoản nhân viên."
      });
      setDeleteCandidateId(null);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees });
    },
    onError: (error) => {
      if (resolveSetupIssue(error)) {
        setFeedback(null);
        return;
      }

      setFeedback({
        tone: "error",
        message: resolveErrorMessage(error, "Không thể xóa tài khoản nhân viên")
      });
    }
  });

  const setupIssue =
    resolveSetupIssue(directoryQuery.error) ??
    resolveSetupIssue(createMutation.error) ??
    resolveSetupIssue(deleteMutation.error);

  function updateSearch(search: string) {
    setParams((current) => ({
      ...current,
      search,
      page: 1
    }));
  }

  function updateRole(role: AppRole | "all") {
    setParams((current) => ({
      ...current,
      role,
      page: 1
    }));
  }

  function updatePage(page: number) {
    setParams((current) => ({
      ...current,
      page
    }));
  }

  function updateCreateField(field: keyof typeof defaultCreateForm, value: string) {
    setCreateForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  function toggleCreateForm() {
    setCreateFormOpen((current) => !current);
    setFeedback(null);
  }

  async function submitCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (setupIssue) {
      return;
    }

    if (createForm.password !== createForm.confirmPassword) {
      setFeedback({
        tone: "error",
        message: "Mật khẩu xác nhận không khớp"
      });
      return;
    }

    const parsed = EmployeeCreateSchema.safeParse({
      fullName: createForm.fullName,
      email: createForm.email,
      password: createForm.password,
      role: createForm.role
    });

    if (!parsed.success) {
      setFeedback({
        tone: "error",
        message: parsed.error.issues[0]?.message ?? "Dữ liệu tạo nhân viên không hợp lệ"
      });
      return;
    }

    await createMutation.mutateAsync(parsed.data);
  }

  function startDelete(item: EmployeeListItem) {
    setDeleteCandidateId(item.id);
    setFeedback(null);
  }

  function cancelDelete() {
    setDeleteCandidateId(null);
  }

  async function confirmDelete(id: string) {
    setFeedback(null);
    await deleteMutation.mutateAsync(id);
  }

  function canDeleteEmployee(item: EmployeeListItem) {
    return currentUser.permissions.canDeleteEmployee && item.role !== "owner" && item.id !== currentUser.identity.id;
  }

  return {
    currentUser,
    params,
    searchValue: params.search ?? "",
    items: directoryQuery.data?.items ?? [],
    totalItems: directoryQuery.data?.totalItems ?? 0,
    totalPages: directoryQuery.data?.totalPages ?? 1,
    note: directoryQuery.data?.note,
    feedback,
    setupIssue,
    permissions: currentUser.permissions,
    isLoading: directoryQuery.isLoading,
    isError: directoryQuery.isError && !setupIssue,
    errorMessage: directoryQuery.error
      ? resolveErrorMessage(directoryQuery.error, "Không thể tải danh sách nhân viên")
      : null,
    isCreateBlocked: Boolean(setupIssue),
    isCreateFormOpen,
    createForm,
    isCreating: createMutation.isPending,
    deleteCandidateId,
    deletingId: deleteMutation.isPending ? deleteCandidateId : null,
    updateSearch,
    updateRole,
    updatePage,
    updateCreateField,
    toggleCreateForm,
    submitCreate,
    startDelete,
    cancelDelete,
    confirmDelete,
    canDeleteEmployee
  };
}
