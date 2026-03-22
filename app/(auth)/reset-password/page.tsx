"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { FullPageSpinner } from "@/components/ui/spinner";
import { AuthCard } from "@/components/auth/auth-card";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { useResetPassword } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/errors";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/auth-schemas";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const resetPassword = useResetPassword();

  async function onSubmit(data: ResetPasswordFormData) {
    try {
      await resetPassword.mutateAsync({
        token,
        newPassword: data.password,
      });
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError("root", { message: err.message });
      } else {
        setError("root", { message: "Something went wrong. Please try again." });
      }
    }
  }

  if (success) {
    return (
      <AuthCard
        title="Password Reset"
        description="Your password has been reset successfully."
      >
        <Link href="/login">
          <Button className="w-full">Go to Login</Button>
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset Your Password"
      description="Choose a new password to secure your account."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root ? (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errors.root.message}
          </p>
        ) : null}

        <div>
          <label
            htmlFor="new-password"
            className="mb-1.5 block text-sm font-medium"
          >
            New Password
          </label>
          <PasswordInput
            id="new-password"
            hint="At least 8 characters"
            {...register("password")}
          />
          {errors.password ? (
            <p className="mt-1.5 text-xs text-destructive">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="mb-1.5 block text-sm font-medium"
          >
            Confirm New Password
          </label>
          <PasswordInput
            id="confirm-password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword ? (
            <p className="mt-1.5 text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={resetPassword.isPending}>
          {resetPassword.isPending ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
