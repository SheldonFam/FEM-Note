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
  isLoading: boolean;
}

interface AuthActions {
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
  hydrateFromStorage: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoading: true,

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

  hydrateFromStorage: () => {
    if (typeof window === "undefined") {
      set({ isLoading: false });
      return;
    }
    const refreshToken = localStorage.getItem("refreshToken");
    set({ refreshToken, isLoading: false });
  },
}));
