import type { ApiError } from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://e-commerce-full-stack-production-2d56.up.railway.app/api";

const SECRET_API_KEY = process.env.API_KEY || "";
console.log(BASE_URL);

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export class ApiClientError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers: extraHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "secret-api-key": SECRET_API_KEY,
    ...(extraHeaders as Record<string, string>),
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // No content (204, 205)
  if (response.status === 204 || response.status === 205) {
    return undefined as T;
  }

  const json = await response.json();

  if (!response.ok) {
    const error = json as ApiError;
    throw new ApiClientError(
      response.status,
      error.message || "An error occurred",
      error.errors,
    );
  }

  return json as T;
}

// ─── Convenience methods ──────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, "body">) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};

// ─── Multipart (file uploads) ─────────────────────────────────────────────────

export async function uploadFile<T>(
  path: string,
  formData: FormData,
  method: "POST" | "PUT" | "PATCH" = "POST",
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers: {
      "secret-api-key": SECRET_API_KEY,
      // Note: do NOT set Content-Type here — browser sets it with boundary
    },
    body: formData,
  });

  const json = await response.json();

  if (!response.ok) {
    const error = json as ApiError;
    throw new ApiClientError(response.status, error.message, error.errors);
  }

  return json as T;
}

// ─── URL builder (for paginated/filtered queries) ─────────────────────────────

export function buildUrl(
  base: string,
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const url = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.append(key, String(value));
    }
  }
  const query = url.toString();
  return query ? `${base}?${query}` : base;
}
