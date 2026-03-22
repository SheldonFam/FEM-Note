"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { FullPageSpinner } from "@/components/ui/spinner";
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

  if (!refreshToken || isError) return null;

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return <>{children}</>;
}
