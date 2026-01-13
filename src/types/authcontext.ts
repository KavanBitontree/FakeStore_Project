type AuthContextType = {
  token: string | null;
  userId: number | null;
  role: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, id: number, role?: string) => void;
  logout: () => void;
};

export { AuthContextType };
