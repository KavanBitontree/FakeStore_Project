import { createContext, useContext, useState, useEffect } from "react";
import { clearCartOnLogout } from "../utils/cartUtils";
import { ROLES } from "../constants/roles";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedUserId && storedRole) {
      setToken(storedToken);
      setUserId(Number(storedUserId));
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  const login = (token, id, role = ROLES.USER) => {
    setToken(token);
    setUserId(id);
    setRole(role);

    localStorage.setItem("token", token);
    localStorage.setItem("userId", id);
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

export const useAuth = () => useContext(AuthContext);
