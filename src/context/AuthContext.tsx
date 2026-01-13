import { createContext, useContext, useState, useEffect } from "react";
import { clearCartOnLogout } from "../utils/cartUtils";
import { ROLES } from "../constants/roles";
import { AuthContextType } from "../types/authcontext";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role") as string | null;

    if (storedToken && storedUserId && storedRole) {
      setToken(storedToken);
      setUserId(Number(storedUserId));
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  const login = (token: string, id: number, role: string = ROLES.USER) => {
    setToken(token);
    setUserId(id);
    setRole(role);

    localStorage.setItem("token", token);
    localStorage.setItem("userId", String(id));
    localStorage.setItem("role", role);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setRole(null);

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    clearCartOnLogout();
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        role,
        isAuthenticated: !!token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
