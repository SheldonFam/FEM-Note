export type FontTheme = "sans" | "serif" | "mono";

export const fontThemeStorageKey = "notes-font-theme";

export function isFontTheme(value: string | null): value is FontTheme {
  return value === "sans" || value === "serif" || value === "mono";
}

export function getStoredFontTheme() {
  if (typeof window === "undefined") {
    return "sans" as const;
  }

  const savedFontTheme = window.localStorage.getItem(fontThemeStorageKey);
  return isFontTheme(savedFontTheme) ? savedFontTheme : "sans";
}

export function applyFontTheme(theme: FontTheme) {
  if (typeof window === "undefined") {
    return;
  }

  document.documentElement.dataset.fontTheme = theme;
  window.localStorage.setItem(fontThemeStorageKey, theme);
}
