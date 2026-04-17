import type { ApiResponse } from "@gold-shop/types";

import { getBrowserSupabaseClient } from "@/lib/supabase/browser";
import { publicEnv } from "@/lib/utils/env";

function buildUrl(path: string): string {
  const baseUrl = publicEnv.apiBaseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

async function getAccessToken(): Promise<string | null> {
  const supabase = getBrowserSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  return session?.access_token ?? null;
}

async function parseJson<T>(response: Response): Promise<ApiResponse<T>> {
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Không thể xử lý yêu cầu");
  }

  return payload;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();
  const headers = new Headers(init.headers);
  const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;

  if (!isFormData) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers
  });

  const payload = await parseJson<T>(response);

  return payload.data;
}

export const httpClient = {
  get: <T>(path: string) => apiRequest<T>(path),
  post: <T>(path: string, body: unknown) =>
    apiRequest<T>(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),
  delete: <T>(path: string) =>
    apiRequest<T>(path, {
      method: "DELETE"
    }),
  patch: <T>(path: string, body: unknown) =>
    apiRequest<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body)
    })
};
