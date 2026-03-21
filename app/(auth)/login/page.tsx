"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { GoogleButton } from "@/components/auth/google-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/errors";
import { loginSchema, type LoginFormData } from "@/lib/auth-schemas";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const login = useLogin();

  async function onSubmit(data: LoginFormData) {
    try {
      await login.mutateAsync(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError("root", { message: err.message });
      } else {
        setError("root", { message: "Something went wrong. Please try again." });
      }
    }
  }

  return (
    <AuthCard title="Welcome to Note" description="Please log in to continue">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root ? (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errors.root.message}
          </p>
        ) : null}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1.5 text-xs text-destructive">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Forgot
            </Link>
          </div>
          <PasswordInput id="password" {...register("password")} />
          {errors.password ? (
            <p className="mt-1.5 text-xs text-destructive">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? "Logging in..." : "Login"}
        </Button>
      </form>

      <div className="mt-4 mb-4 h-px bg-border" />

      <div className="mt-6 mb-4 flex justify-center items-center gap-4">
        <span className="text-xs text-muted-foreground">Or log in with:</span>
      </div>

      <GoogleButton />

      <div className="mt-4 mb-4 h-px bg-border" />

      <p className="text-center text-sm text-muted-foreground">
        No account yet?{" "}
        <Link
          href="/signup"
          className="font-medium text-foreground hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </AuthCard>
  );
}
