"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/stores/auth";
import { useCurrentUser } from "@/hooks/use-auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { refreshToken, isLoading, hydrateFromStorage } = useAuthStore();
  const { isLoading: isUserLoading, isError } = useCurrentUser();

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    if (!isLoading && !refreshToken) {
      router.push("/login");
    }
  }, [isLoading, refreshToken, router]);

  useEffect(() => {
    if (isError) {
      useAuthStore.getState().clearAuth();
      router.push("/login");
    }
  }, [isError, router]);

  if (isLoading || (!refreshToken && !isError)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
