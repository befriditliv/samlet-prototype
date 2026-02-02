import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "key_account_manager" | "key_account_manager_app" | "manager" | null;

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    const stored = localStorage.getItem("jarvis_role");
    return stored as UserRole;
  });

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole) {
      localStorage.setItem("jarvis_role", newRole);
    } else {
      localStorage.removeItem("jarvis_role");
    }
  };

  const logout = () => {
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ role, setRole, logout, isAuthenticated: !!role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
