import type { AuthUser } from "@/lib/stores/auth";
import { post, get } from "./client";

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface MeResponse {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  isEmailVerified: boolean;
}

export function apiGoogleLogin(accessToken: string) {
  return post<AuthResponse>("/auth/google", { accessToken });
}

export function apiLogin(email: string, password: string) {
  return post<AuthResponse>("/auth/login", { email, password });
}

export function apiSignup(email: string, password: string) {
  return post<AuthResponse>("/auth/signup", { email, password });
}

export function apiLogout(refreshToken: string) {
  return post<void>("/auth/logout", { refreshToken });
}

export function apiRefreshToken(refreshToken: string) {
  return post<TokenPair>("/auth/refresh", { refreshToken });
}

export function apiGetMe() {
  return get<MeResponse>("/auth/me");
}

export function apiChangePassword(
  currentPassword: string,
  newPassword: string,
) {
  return post<TokenPair>("/auth/change-password", {
    currentPassword,
    newPassword,
  });
}

export function apiForgotPassword(email: string) {
  return post<{ message: string }>("/auth/forgot-password", { email });
}

export function apiResetPassword(token: string, newPassword: string) {
  return post<{ message: string }>("/auth/reset-password", {
    token,
    newPassword,
  });
}
