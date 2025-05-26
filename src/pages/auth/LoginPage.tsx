import { AxiosError } from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFormattedErrorMessage } from "../../common/constants/errorMessages";
import { AuthFormContainer } from "../../components/auth/AuthFormContainer";
import { LoginForm } from "../../components/auth/LoginForm";
import { AuthServiceError } from "../../services/authService";
import type { AppDispatch, RootState } from "../../store";
import { login } from "../../store/slices/authSlice";
import type { LoginCredentials } from "../../types/auth";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: LoginCredentials) => {
    try {
      setError(null);
      await dispatch(login(values)).unwrap();
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof AuthServiceError) {
        setError(err.message);
      } else if (err instanceof AxiosError) {
        const status = err.response?.status;
        if (status === 401) {
          setError(getFormattedErrorMessage("AUTH", "INVALID_CREDENTIALS"));
        } else if (status === 400) {
          setError(getFormattedErrorMessage("VALIDATION", "INVALID_INPUT"));
        } else {
          setError(getFormattedErrorMessage("NETWORK", "SERVER_ERROR"));
        }
      } else {
        setError(getFormattedErrorMessage("NETWORK", "UNKNOWN"));
      }
    }
  };

  return (
    <AuthFormContainer
      title="Sign In"
      subtitle="Welcome back! Please sign in to your account to continue"
    >
      <LoginForm
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        onErrorDismiss={() => setError(null)}
      />
    </AuthFormContainer>
  );
};

export default LoginPage;
