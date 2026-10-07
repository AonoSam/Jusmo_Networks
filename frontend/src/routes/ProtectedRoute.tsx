import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  allowedRoles?: Array<"super_admin" | "manager" | "staff">;
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950">
        <p className="text-navy-300">Checking session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/staff/login" state={{ from: location }} replace />;
  }

  if (user.must_change_password && location.pathname !== "/staff/change-password") {
    return <Navigate to="/staff/change-password" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950">
        <p className="text-navy-300">You do not have permission to view this page.</p>
      </div>
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;