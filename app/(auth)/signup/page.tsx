"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { GoogleButton } from "@/components/auth/google-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupSchema, type SignupFormData } from "@/lib/auth-schemas";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  function onSubmit(data: SignupFormData) {
    // TODO: implement auth
    console.log(data);
  }

  return (
    <AuthCard
      title="Create Your Account"
      description="Sign up to start organizing your notes and boost your productivity."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium"
          >
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
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium"
          >
            Password
          </label>
          <PasswordInput
            id="password"
            hint="At least 8 characters"
            {...register("password")}
          />
          {errors.password ? (
            <p className="mt-1.5 text-xs text-destructive">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="w-full">
          Sign up
        </Button>
      </form>

      <div className="mt-4 mb-4 h-px bg-border" />

      <div className="mt-6 mb-4 flex justify-center items-center gap-4">
        <span className="text-xs text-muted-foreground">Or sign up with:</span>
      </div>

      <GoogleButton />

      <div className="mt-4 mb-4 h-px bg-border" />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground hover:underline"
        >
          Login
        </Link>
      </p>
    </AuthCard>
  );
}
