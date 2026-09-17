import { createContext, useContext, useState, useCallback } from "react";
import { login as loginApi } from "../api/authApi";
import { extractErrorMessage } from "../api/client";

const AuthContext = createContext(null);

// Safely parse local storage on initial app load only
function getInitialAuthState() {
  try {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");
    if (!token || !rawUser) return { user: null, token: null };
    return { user: JSON.parse(rawUser), token };
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuthState);

  const login = useCallback(async (email, password) => {
    try {
      const data = await loginApi({ email, password });
      const nextUser = {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(nextUser));

      setAuthState({ token: data.token, user: nextUser });
      return { ok: true, user: nextUser };
    } catch (err) {
      return { ok: false, error: extractErrorMessage(err) };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState({ token: null, user: null });
  }, []);

  const value = {
    user: authState.user,
    token: authState.token,
    // Guarantees both token AND user exist before treating user as authenticated
    isAuthenticated: !!authState.token && !!authState.user,
    isAdmin: authState.user?.role === "ADMIN",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}