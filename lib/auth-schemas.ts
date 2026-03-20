import { z } from "zod";

const email = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email");

const password = z
  .string()
  .min(1, "Password is required");

const newPassword = z
  .string()
  .min(8, "Password must be at least 8 characters");

export const loginSchema = z.object({
  email,
  password,
});

export const signupSchema = z.object({
  email,
  password: newPassword,
});

export const forgotPasswordSchema = z.object({
  email,
});

export const changePasswordSchema = z
  .object({
    oldPassword: password,
    newPassword: newPassword,
    confirmNewPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export const resetPasswordSchema = z
  .object({
    password: newPassword,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
