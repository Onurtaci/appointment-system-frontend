import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import * as yup from "yup";
import type { LoginFormData, LoginFormProps } from "../../types/auth";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password should be at least 6 characters")
    .required("Password is required"),
});

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading,
  error,
  onErrorDismiss,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik<LoginFormData>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: "100%" }}>
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            width: "100%",
            "& .MuiAlert-message": { width: "100%" },
          }}
          onClose={onErrorDismiss}
        >
          {error}
        </Alert>
      )}

      <TextField
        margin="normal"
        fullWidth
        id="email"
        name="email"
        label="Email Address"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        autoComplete="email"
        autoFocus
        sx={{
          "& .MuiInputBase-input": {
            "&:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0 100px rgba(25, 118, 210, 0.04) inset",
              WebkitTextFillColor: "rgba(0, 0, 0, 0.87)",
              caretColor: "rgba(0, 0, 0, 0.87)",
              transition: "background-color 5000s ease-in-out 0s",
              "&:hover": {
                WebkitBoxShadow: "0 0 0 100px rgba(25, 118, 210, 0.08) inset",
              },
            },
            "&:-webkit-autofill:focus": {
              WebkitBoxShadow: "0 0 0 100px rgba(25, 118, 210, 0.08) inset",
              WebkitTextFillColor: "rgba(0, 0, 0, 0.87)",
              caretColor: "rgba(0, 0, 0, 0.87)",
            },
          },
        }}
      />

      <TextField
        margin="normal"
        fullWidth
        id="password"
        name="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        autoComplete="current-password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiInputBase-input": {
            "&:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0 100px rgba(25, 118, 210, 0.04) inset",
              WebkitTextFillColor: "rgba(0, 0, 0, 0.87)",
              caretColor: "rgba(0, 0, 0, 0.87)",
              transition: "background-color 5000s ease-in-out 0s",
              "&:hover": {
                WebkitBoxShadow: "0 0 0 100px rgba(25, 118, 210, 0.08) inset",
              },
            },
            "&:-webkit-autofill:focus": {
              WebkitBoxShadow: "0 0 0 100px rgba(25, 118, 210, 0.08) inset",
              WebkitTextFillColor: "rgba(0, 0, 0, 0.87)",
              caretColor: "rgba(0, 0, 0, 0.87)",
            },
          },
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        sx={{
          mt: 3,
          mb: 2,
          py: 1.5,
          fontSize: "1.1rem",
          textTransform: "none",
          borderRadius: 2,
        }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
      </Button>

      <Box
        sx={{
          width: "100%",
          textAlign: "center",
          mt: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          Don&apos;t have an account?{" "}
          <Link
            component={RouterLink}
            to="/register"
            sx={{
              fontWeight: 500,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Create account
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};
