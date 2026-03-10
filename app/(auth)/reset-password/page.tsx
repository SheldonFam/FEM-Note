"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthCard } from "@/components/auth/auth-card";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/auth-schemas";

export default function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  function onSubmit(data: ResetPasswordFormData) {
    // TODO: implement password reset
    console.log(data);
  }

  return (
    <AuthCard
      title="Reset Your Password"
      description="Choose a new password to secure your account."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <Button type="submit" className="w-full">
          Reset Password
        </Button>
      </form>
    </AuthCard>
  );
}
