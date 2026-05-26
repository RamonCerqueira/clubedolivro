import { useUserStore } from "@/store/useUserStore";
import api from "@/services/api";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { user, setUser, logout: clearStore } = useUserStore();
  const router = useRouter();

  const login = async (credentials: any) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      localStorage.setItem("token", data.accessToken);
      setUser(data.user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    clearStore();
    router.push("/");
  };

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
