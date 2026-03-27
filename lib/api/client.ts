import { useAuthStore } from "@/lib/stores/auth";
import { ApiError } from "./errors";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

let refreshPromise: Promise<void> | null = null;

async function refreshTokens(): Promise<void> {
  const { refreshToken, setTokens, clearAuth } = useAuthStore.getState();
  if (!refreshToken) {
    clearAuth();
    throw new ApiError(401, "No refresh token");
  }

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearAuth();
    throw new ApiError(401, "Refresh failed");
  }

  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { accessToken, refreshToken } = useAuthStore.getState();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };

  // If no access token but refresh token exists, refresh before the request
  if (!accessToken && refreshToken) {
    if (!refreshPromise) {
      refreshPromise = refreshTokens().finally(() => {
        refreshPromise = null;
      });
    }
    try {
      await refreshPromise;
    } catch {
      throw new ApiError(401, "Session expired");
    }
  }

  const currentToken = useAuthStore.getState().accessToken;
  if (currentToken) {
    headers["Authorization"] = `Bearer ${currentToken}`;
  }

  let res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // If 401 and we have a refresh token, try refreshing once
  if (res.status === 401 && useAuthStore.getState().refreshToken) {
    if (!refreshPromise) {
      refreshPromise = refreshTokens().finally(() => {
        refreshPromise = null;
      });
    }

    try {
      await refreshPromise;
    } catch {
      throw new ApiError(401, "Session expired");
    }

    const newToken = useAuthStore.getState().accessToken;
    headers["Authorization"] = `Bearer ${newToken}`;
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      body.message ?? "Request failed",
      body.errors,
    );
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as unknown as T;
  }

  return res.json();
}

export function get<T>(path: string): Promise<T> {
  return request<T>(path, { method: "GET" });
}

export function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function patch<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function del<T>(path: string): Promise<T> {
  return request<T>(path, { method: "DELETE" });
}
