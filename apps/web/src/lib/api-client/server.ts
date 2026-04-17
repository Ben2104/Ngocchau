import "server-only";

import type { ApiResponse } from "@gold-shop/types";

import { publicEnv } from "@/lib/utils/env";

const SERVER_API_TIMEOUT_MS = 4000;

export class BackendUnavailableError extends Error {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "BackendUnavailableError";
    this.cause = cause;
  }
}

export class ApiResponseError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ApiResponseError";
  }
}

function buildUrl(path: string) {
  const baseUrl = publicEnv.apiBaseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

async function parseJson<T>(response: Response): Promise<ApiResponse<T>> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    if (!response.ok) {
      throw new ApiResponseError(response.statusText || "Không thể xử lý yêu cầu", response.status);
    }

    throw new Error("API response is not valid JSON");
  }

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    throw new ApiResponseError(payload.message || response.statusText || "Không thể xử lý yêu cầu", response.status);
  }

  if (!payload.success) {
    throw new Error(payload.message || "Không thể xử lý yêu cầu");
  }

  return payload;
}

export async function serverApiRequest<T>(path: string, accessToken: string): Promise<T> {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), SERVER_API_TIMEOUT_MS);
  let response: Response;

  try {
    response = await fetch(buildUrl(path), {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      cache: "no-store",
      signal: abortController.signal
    });
  } catch (error) {
    const isAborted = error instanceof DOMException && error.name === "AbortError";
    const isFetchFailure = error instanceof TypeError && error.message.toLowerCase().includes("fetch failed");

    if (isAborted || isFetchFailure) {
      throw new BackendUnavailableError("Không thể kết nối tới API nội bộ", error);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  const payload = await parseJson<T>(response);

  return payload.data;
}
