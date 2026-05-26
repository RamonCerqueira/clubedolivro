import api from "./api";

export const authService = {
  async login(credentials: any) {
    const { data } = await api.post("/auth/login", credentials);
    if (data.access_token) {
      localStorage.setItem("auth_token", data.access_token);
    }
    return data;
  },

  async register(userData: any) {
    const { data } = await api.post("/auth/register", userData);
    return data;
  },

  async getProfile() {
    const { data } = await api.get("/auth/profile");
    return data;
  },

  logout() {
    localStorage.removeItem("auth_token");
  }
};
