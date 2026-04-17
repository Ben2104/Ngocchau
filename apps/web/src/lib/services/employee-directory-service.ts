import { EMPLOYEE_DIRECTORY_PAGE_SIZE, ROLE_LABELS } from "@gold-shop/constants";
import type {
  EmployeeDeleteResult,
  EmployeeDirectoryResponse,
  EmployeeListItem,
  EmployeeListParams
} from "@gold-shop/types";
import type { EmployeeCreateInput } from "@gold-shop/validation";

import { httpClient } from "@/lib/api-client/http-client";

export interface EmployeeDirectoryQueryResult {
  items: EmployeeListItem[];
  totalItems: number;
  totalPages: number;
  note?: string;
}

function sortEmployees(items: EmployeeListItem[], params: EmployeeListParams) {
  const direction = params.sortDirection === "asc" ? 1 : -1;
  const sortBy = params.sortBy ?? "joinedAt";

  return [...items].sort((left, right) => {
    if (sortBy === "name") {
      return left.profile.fullName.localeCompare(right.profile.fullName, "vi") * direction;
    }

    if (sortBy === "role") {
      return ROLE_LABELS[left.role].localeCompare(ROLE_LABELS[right.role], "vi") * direction;
    }

    return (new Date(left.joinedAt).getTime() - new Date(right.joinedAt).getTime()) * direction;
  });
}

function filterEmployees(items: EmployeeListItem[], params: EmployeeListParams) {
  const searchTerm = params.search?.trim().toLowerCase() ?? "";

  return items.filter((item) => {
    const matchesRole = !params.role || params.role === "all" ? true : item.role === params.role;
    const matchesSearch =
      searchTerm === "" ||
      item.profile.fullName.toLowerCase().includes(searchTerm) ||
      (item.profile.email?.toLowerCase().includes(searchTerm) ?? false) ||
      ROLE_LABELS[item.role].toLowerCase().includes(searchTerm);

    return matchesRole && matchesSearch;
  });
}

export async function getEmployeeDirectory(params: EmployeeListParams): Promise<EmployeeDirectoryQueryResult> {
  const response = await httpClient.get<EmployeeDirectoryResponse>("/employees");
  const filteredItems = filterEmployees(response.items, params);
  const sortedItems = sortEmployees(filteredItems, params);
  const pageSize = params.pageSize || EMPLOYEE_DIRECTORY_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  const currentPage = Math.min(params.page || 1, totalPages);
  const startIndex = (currentPage - 1) * pageSize;

  return {
    items: sortedItems.slice(startIndex, startIndex + pageSize),
    totalItems: sortedItems.length,
    totalPages,
    note: response.note
  };
}

export function createEmployee(input: EmployeeCreateInput) {
  return httpClient.post<EmployeeListItem>("/employees", input);
}

export function deleteEmployee(id: string) {
  return httpClient.delete<EmployeeDeleteResult>(`/employees/${id}`);
}
