import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const stored = localStorage.getItem("authUser");
  const user = stored ? JSON.parse(stored) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
