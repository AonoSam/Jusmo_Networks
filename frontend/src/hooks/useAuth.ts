import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createElement } from "react";

import {
  staffLogin,
  staffLogout,
  getCurrentUser,
  type StaffUser,
  type LoginCredentials,
} from "../api/auth";

interface AuthContextValue {
  user: StaffUser | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshUser = async () => {
  const currentUser = await getCurrentUser();
  setUser(currentUser);
};

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        // No valid cookie session — fine, stay logged out
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const data = await staffLogin(credentials);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await staffLogout();
    } catch {
      // Clear local state regardless, so the UI reflects logged-out
    }
    setUser(null);
  };

  return createElement(
    AuthContext.Provider,
    { value: { user, loading, login, logout, refreshUser } },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}