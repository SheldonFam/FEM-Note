"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { GoogleButton } from "@/components/auth/google-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormData } from "@/lib/auth-schemas";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginFormData) {
    // TODO: implement auth
    console.log(data);
  }

  return (
    <AuthCard title="Welcome to Note" description="Please log in to continue">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <Button type="submit" className="w-full">
          Login
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
