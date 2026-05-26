import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  level: number;
  points: number;
  streak: number;
  city?: string;
  interests?: string[];
  bio?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string, refreshToken?: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setToken: (token: string) => void;
}

// Helper: set/clear cookie for middleware access
function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, token, refreshToken) => {
        // Store in localStorage for Axios interceptor
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", token);
          if (refreshToken) {
            localStorage.setItem("refresh_token", refreshToken);
          }
        }
        // Store in cookie for Next.js middleware
        setCookie("auth_token", token, 0.01); // 15min — matches access token
        set({ user, token, refreshToken: refreshToken || null, isAuthenticated: true });
      },

      setToken: (token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", token);
        }
        setCookie("auth_token", token, 0.01);
        set({ token });
      },

      updateUser: (newUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...newUser } : null,
        })),

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
        }
        deleteCookie("auth_token");
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
