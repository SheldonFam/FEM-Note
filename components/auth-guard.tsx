"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/stores/auth";
import { useCurrentUser } from "@/hooks/use-auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const { isLoading, isError } = useCurrentUser();

  useEffect(() => {
    if (!refreshToken || isError) {
      useAuthStore.getState().clearAuth();
      router.push("/login");
    }
  }, [refreshToken, isError, router]);

  if (!refreshToken) return null;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
