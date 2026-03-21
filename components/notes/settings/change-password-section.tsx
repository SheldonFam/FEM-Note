import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PasswordInput } from "@/components/auth/password-input";
import { showToast } from "@/components/notes/toast-notification";
import { Button } from "@/components/ui/button";
import { useChangePassword } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/errors";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/lib/auth-schemas";

export function ChangePasswordSection() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const changePassword = useChangePassword();

  async function onSubmit(data: ChangePasswordFormData) {
    try {
      await changePassword.mutateAsync({
        currentPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      showToast("Password changed successfully!");
      reset();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 400) {
          setError("oldPassword", { message: err.message });
        } else {
          showToast(err.message);
        }
      } else {
        showToast("Failed to change password.");
      }
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold">Change Password</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="oldPassword"
            className="mb-1.5 block text-sm font-medium"
          >
            Old Password
          </label>
          <PasswordInput id="oldPassword" {...register("oldPassword")} />
          {errors.oldPassword ? (
            <p className="mt-1.5 text-xs text-destructive">
              {errors.oldPassword.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="mb-1.5 block text-sm font-medium"
          >
            New Password
          </label>
          <PasswordInput
            id="newPassword"
            hint="At least 8 characters"
            {...register("newPassword")}
          />
          {errors.newPassword ? (
            <p className="mt-1.5 text-xs text-destructive">
              {errors.newPassword.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="confirmNewPassword"
            className="mb-1.5 block text-sm font-medium"
          >
            Confirm New Password
          </label>
          <PasswordInput
            id="confirmNewPassword"
            {...register("confirmNewPassword")}
          />
          {errors.confirmNewPassword ? (
            <p className="mt-1.5 text-xs text-destructive">
              {errors.confirmNewPassword.message}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={changePassword.isPending}>
            {changePassword.isPending ? "Saving..." : "Save Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
