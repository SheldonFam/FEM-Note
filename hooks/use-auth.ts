"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  apiLogin,
  apiSignup,
  apiGoogleLogin,
  apiLogout,
  apiGetMe,
  apiChangePassword,
  apiForgotPassword,
  apiResetPassword,
} from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/auth";

export function useLogin() {
  const router = useRouter();
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiLogin(email, password),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      router.push("/");
    },
  });
}

export function useSignup() {
  const router = useRouter();
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiSignup(email, password),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      router.push("/");
    },
  });
}

export function useGoogleAuth() {
  const router = useRouter();
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (accessToken: string) => apiGoogleLogin(accessToken),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      router.push("/");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      const token = useAuthStore.getState().refreshToken;
      if (token) return apiLogout(token);
      return Promise.resolve();
    },
    onSettled: () => {
      useAuthStore.getState().clearAuth();
      queryClient.clear();
      router.push("/login");
    },
  });
}

export function useCurrentUser() {
  const refreshToken = useAuthStore((s) => s.refreshToken);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const me = await apiGetMe();
      useAuthStore.getState().setUser({
        id: me.id,
        email: me.email,
        createdAt: me.createdAt,
      });
      return me;
    },
    enabled: !!refreshToken,
    retry: false,
  });
}

export function useChangePassword() {
  const { setTokens } = useAuthStore();

  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => apiChangePassword(currentPassword, newPassword),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => apiForgotPassword(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => apiResetPassword(token, newPassword),
  });
}
