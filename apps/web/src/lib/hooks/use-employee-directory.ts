"use client";

import { useDeferredValue, useState } from "react";

import { EMPLOYEE_DIRECTORY_PAGE_SIZE, QUERY_KEYS } from "@gold-shop/constants";
import type { AppRole, EmployeeListParams } from "@gold-shop/types";
import { useQuery } from "@tanstack/react-query";

import { getEmployeeDirectory } from "@/lib/services/employee-directory-service";
import { useCurrentUser } from "@/providers/current-user-provider";

const defaultParams: EmployeeListParams = {
  page: 1,
  pageSize: EMPLOYEE_DIRECTORY_PAGE_SIZE,
  search: "",
  sortBy: "joinedAt",
  sortDirection: "desc",
  role: "all"
};

const securityNotice = {
  title: "Quyền truy cập được tách theo vai trò vận hành",
  description: "Role guard đang đi qua permission map tập trung để sau này nối policy backend mà không sửa lại UI.",
  actionLabel: "Xem chính sách truy cập"
};

export function useEmployeeDirectory() {
  const currentUser = useCurrentUser();
  const [params, setParams] = useState<EmployeeListParams>(defaultParams);
  const deferredSearch = useDeferredValue(params.search ?? "");
  const queryParams = {
    ...params,
    search: deferredSearch
  };

  const directoryQuery = useQuery({
    queryKey: [...QUERY_KEYS.employees, queryParams, currentUser.role],
    queryFn: () => getEmployeeDirectory(queryParams)
  });

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

  return {
    currentUser,
    params,
    searchValue: params.search ?? "",
    items: (directoryQuery.data?.items ?? []).map((item) => ({
      ...item,
      canEditRole: item.canEditRole && currentUser.permissions.canEditRoles
    })),
    totalItems: directoryQuery.data?.totalItems ?? 0,
    totalPages: directoryQuery.data?.totalPages ?? 1,
    note: directoryQuery.data?.note,
    usesMockData: directoryQuery.data?.usesMockData ?? true,
    permissions: currentUser.permissions,
    securityNotice,
    isLoading: directoryQuery.isLoading,
    isError: directoryQuery.isError,
    updateSearch,
    updateRole,
    updatePage
  };
}
