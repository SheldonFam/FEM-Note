"use client";

import { useEffect } from "react";

import { applyFontTheme, getStoredFontTheme } from "@/lib/font-theme";

export function FontThemeProvider() {
  useEffect(() => {
    applyFontTheme(getStoredFontTheme());
  }, []);

  return null;
}
