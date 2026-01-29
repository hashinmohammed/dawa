import { client } from "../../../lib/axios";

// Helper functions to manage localStorage
const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const createAuthSlice = (set, get) => ({
  user: getUserFromStorage(),
  accessToken: null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isAuthenticated: !!localStorage.getItem("refreshToken"),

  login: (user, accessToken, refreshToken) => {
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, accessToken, refreshToken, isAuthenticated: true });
  },

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  logout: async () => {
    const { refreshToken } = get();

    // Always clear local storage first for immediate UI update
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });

    // Then try to invalidate token on server
    // Even if this fails, user is logged out locally
    try {
      if (refreshToken) {
        await client.post("/api/auth/logout", { refreshToken });
      }
    } catch (error) {
      // Silently fail - user is already logged out locally
      console.error("Logout API error:", error);
    }
  },
});
