import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../../store";
import LoadingSpinner from "./LoadingSpinner";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
