"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthCard } from "@/components/auth/auth-card";
import { FormError } from "@/components/auth/form-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/hooks/use-auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/auth-schemas";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const forgotPassword = useForgotPassword();

  async function onSubmit(data: ForgotPasswordFormData) {
    try {
      await forgotPassword.mutateAsync(data);
      setSubmitted(true);
    } catch {
      // Error is available via forgotPassword.error
    }
  }

  if (submitted) {
    return (
      <AuthCard
        title="Check your email"
        description="If that email exists, we've sent a link to reset your password."
      >
        <p className="text-center text-sm text-muted-foreground">
          Didn&apos;t receive it? Check your spam folder.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgotten your password?"
      description="Enter your email below, and we'll send you a link to reset it."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FormError message={errors.email?.message} />
        </div>

        {forgotPassword.isError && (
          <FormError
            message={
              forgotPassword.error instanceof Error
                ? forgotPassword.error.message
                : "Something went wrong. Please try again."
            }
          />
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={forgotPassword.isPending}
        >
          {forgotPassword.isPending ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </AuthCard>
  );
}
