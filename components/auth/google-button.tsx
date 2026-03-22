"use client";

import Image from "next/image";
import { useGoogleLogin } from "@react-oauth/google";

import { useGoogleAuth } from "@/hooks/use-auth";
import { showToast } from "@/components/notes/toast-notification";
import { Button } from "@/components/ui/button";

export function GoogleButton() {
  const googleAuth = useGoogleAuth();

  const login = useGoogleLogin({
    onSuccess: (response) => {
      googleAuth.mutate(response.access_token);
    },
    onError: () => {
      showToast("Google sign-in failed. Please try again.");
    },
  });

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => login()}
      disabled={googleAuth.isPending}
      className="w-full gap-3"
    >
      <Image
        src="/assets/images/icon-google.svg"
        alt=""
        width={20}
        height={20}
        className="size-5"
      />
      {googleAuth.isPending ? "Signing in..." : "Google"}
    </Button>
  );
}
