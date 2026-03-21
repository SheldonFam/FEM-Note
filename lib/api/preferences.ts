import { get, patch } from "./client";

export interface Preferences {
  colorTheme: "light" | "dark" | "system";
  fontTheme: "sans" | "serif" | "mono";
}

export function apiGetPreferences() {
  return get<Preferences>("/preferences");
}

export function apiUpdatePreferences(data: Partial<Preferences>) {
  return patch<Preferences>("/preferences", data);
}
