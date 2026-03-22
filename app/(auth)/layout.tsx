"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-8">
        {children}
      </div>
    </GoogleOAuthProvider>
  );
}
