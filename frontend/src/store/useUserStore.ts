import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  user: any | null;
  onboardingCompleted: boolean;
  setUser: (user: any) => void;
  completeOnboarding: () => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      onboardingCompleted: false,
      setUser: (user) => set({ user }),
      completeOnboarding: () => set({ onboardingCompleted: true }),
      logout: () => set({ user: null, onboardingCompleted: false }),
    }),
    {
      name: "user-storage",
    }
  )
);
