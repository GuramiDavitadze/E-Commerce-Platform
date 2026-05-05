import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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
  _hasHydrated: boolean;

  // Actions
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  clearError: () => void;
  setHasHydrated: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      _hasHydrated: false,

      setHasHydrated: (val) => set({ _hasHydrated: val }),

      login: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post<AuthResponse>("/auth/login", payload);
          set({ user: res.data, isLoading: false });
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
          set({ user: res.data, isLoading: false });
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
          console.log(res.data);

          set({ user: res.data, isLoading: false });
        } catch {
          // Not authenticated — clear silently
          set({ user: null, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      // Only persist user — never persist isLoading, error, or hydration flag
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        // Fired after localStorage is read and merged into the store
        state?.setHasHydrated(true);
      },
    },
  ),
);

// ─── Selector helpers ─────────────────────────────────────────────────────────

export const useUser = () => useAuthStore((s) => s.user);
export const useIsAdmin = () => useAuthStore((s) => s.user?.role === "ADMIN");
export const useIsAuthenticated = () => useAuthStore((s) => !!s.user);
export const useHasHydrated = () => useAuthStore((s) => s._hasHydrated);
