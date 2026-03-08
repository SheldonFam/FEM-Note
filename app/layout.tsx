import type { Metadata } from "next";
import { Inter, Noto_Serif, Source_Code_Pro } from "next/font/google";

import { Toaster } from "sonner";

import { FontThemeProvider } from "@/components/font-theme-provider";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notes",
  description:
    "A focused note-taking workspace with archiving, tags, and theme customization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-font-theme="sans">
      <body
        className={`${inter.variable} ${notoSerif.variable} ${sourceCodePro.variable} bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FontThemeProvider />
          {children}
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
