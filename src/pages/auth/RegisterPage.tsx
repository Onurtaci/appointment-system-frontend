import { AxiosError } from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getFormattedErrorMessage,
  getHttpErrorMessage,
} from "../../common/constants/errorMessages";
import { AuthFormContainer } from "../../components/auth/AuthFormContainer";
import { RegisterForm } from "../../components/auth/RegisterForm";
import { AuthServiceError } from "../../services/authService";
import type { AppDispatch, RootState } from "../../store";
import { register } from "../../store/slices/authSlice";
import type { RegisterData } from "../../types/auth";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: RegisterData) => {
    try {
      setError(null);
      await dispatch(register(values)).unwrap();
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof AuthServiceError) {
        setError(err.message);
      } else if (err instanceof AxiosError) {
        const status = err.response?.status;
        const errorData = err.response?.data;
        setError(getHttpErrorMessage(status || 500, errorData?.message));
      } else {
        setError(getFormattedErrorMessage("NETWORK", "UNKNOWN"));
      }
    }
  };

  return (
    <AuthFormContainer
      title="Create Account"
      subtitle="Join our medical appointment system to manage your healthcare appointments efficiently"
    >
      <RegisterForm
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        onErrorDismiss={() => setError(null)}
      />
    </AuthFormContainer>
  );
};

export default RegisterPage;
