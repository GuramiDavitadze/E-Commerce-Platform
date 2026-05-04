import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, ApiClientError } from "@/lib/api";
import type {
  User,
  LoginPayload,
  RegisterPayload,
  AuthResponse,
} from "@/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post<AuthResponse>("/auth/login", payload);
          set({ user: res.data.user, isLoading: false });
        } catch (err) {
          const message =
            err instanceof ApiClientError ? err.message : "Login failed";
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post<AuthResponse>("/auth/register", payload);
          set({ user: res.data.user, isLoading: false });
        } catch (err) {
          const message =
            err instanceof ApiClientError ? err.message : "Registration failed";
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await api.post("/auth/logout");
        } finally {
          set({ user: null, isLoading: false });
        }
      },

      fetchMe: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.get<AuthResponse>("/auth/me");
          set({ user: res.data.user, isLoading: false });
        } catch {
          // Not authenticated — clear silently
          set({ user: null, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-store",
      // Only persist the user object; auth is verified via cookie on fetchMe
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

// ─── Selector helpers ─────────────────────────────────────────────────────────

export const useUser = () => useAuthStore((s) => s.user);
export const useIsAdmin = () => useAuthStore((s) => s.user?.role === "ADMIN");
export const useIsAuthenticated = () => useAuthStore((s) => !!s.user);
