import { create } from "zustand";

export interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
}

interface AuthActions {
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
}

export type AuthStore = AuthState & AuthActions;

function getInitialRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  refreshToken: getInitialRefreshToken(),
  user: null,

  setTokens: (accessToken, refreshToken) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("refreshToken", refreshToken);
    }
    set({ accessToken, refreshToken });
  },

  setUser: (user) => set({ user }),

  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("refreshToken");
    }
    set({ accessToken: null, refreshToken: null, user: null });
  },

}));
