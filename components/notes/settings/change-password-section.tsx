import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PasswordInput } from "@/components/auth/password-input";
import { showToast } from "@/components/notes/toast-notification";
import { Button } from "@/components/ui/button";
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
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  function onSubmit(data: ChangePasswordFormData) {
    // TODO: implement password change
    console.log(data);
    showToast("Password changed successfully!");
    reset();
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
          <Button type="submit">Save Password</Button>
        </div>
      </form>
    </div>
  );
}
