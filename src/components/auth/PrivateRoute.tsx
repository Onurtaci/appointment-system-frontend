import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import type { RootState } from "../../store";
import LoadingSpinner from "../common/LoadingSpinner";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const location = useLocation();
  const { isAuthenticated, user, loading } = useSelector(
    (state: RootState) => state.auth
  );

  if (loading) {
    return <LoadingSpinner message="Checking access..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
