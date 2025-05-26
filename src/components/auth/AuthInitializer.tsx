import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import { getCurrentUser, setAuth } from "../../store/slices/authSlice";
import LoadingSpinner from "../common/LoadingSpinner";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const tokenLS = localStorage.getItem("token");
    const userLS = localStorage.getItem("user");

    if (tokenLS && userLS && !isAuthenticated) {
      dispatch(
        setAuth({
          token: tokenLS,
          user: JSON.parse(userLS),
          isAuthenticated: true,
        })
      );
      return;
    }

    if (tokenLS && !userLS && !isAuthenticated && !loading) {
      dispatch(getCurrentUser())
        .unwrap()
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        });
    }
  }, [dispatch, isAuthenticated, loading, navigate]);

  if (loading) {
    return <LoadingSpinner message="Initializing authentication..." />;
  }

  return <>{children}</>;
};

export default AuthInitializer;
