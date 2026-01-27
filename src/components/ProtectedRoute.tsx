import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect manager away from KAM-specific pages
  if (role === "manager" && location.pathname === "/") {
    return <Navigate to="/manager" replace />;
  }

  // Redirect KAM away from manager-specific pages
  if (role === "key_account_manager" && location.pathname.startsWith("/manager")) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
