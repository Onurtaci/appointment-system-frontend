import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import * as yup from "yup";
import type { RegisterFormData, RegisterFormProps } from "../../types/auth";

const validationSchema = yup.object({
  firstName: yup
    .string()
    .min(2, "First name should be at least 2 characters")
    .max(50, "First name should not exceed 50 characters")
    .required("First name is required"),
  lastName: yup
    .string()
    .min(2, "Last name should be at least 2 characters")
    .max(50, "Last name should not exceed 50 characters")
    .required("Last name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password should be at least 6 characters")
    .matches(/^\d+$/, "Password must contain only numbers")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  role: yup
    .string()
    .oneOf(["PATIENT", "DOCTOR"], "Please select a valid role")
    .required("Role is required"),
});

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  loading,
  error,
  onErrorDismiss,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik<RegisterFormData>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "" as "PATIENT" | "DOCTOR",
    },
    validationSchema,
    onSubmit: async (values) => {
      const submitData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: values.role,
      };
      await onSubmit(submitData);
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

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="firstName"
            name="firstName"
            label="First Name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
            autoFocus
            sx={{
              "& .MuiInputBase-input": {
                "&:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px rgba(25, 118, 210, 0.04) inset",
                  WebkitTextFillColor: "rgba(0, 0, 0, 0.87)",
                  caretColor: "rgba(0, 0, 0, 0.87)",
                  transition: "background-color 5000s ease-in-out 0s",
                  "&:hover": {
                    WebkitBoxShadow:
                      "0 0 0 100px rgba(25, 118, 210, 0.08) inset",
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="lastName"
            name="lastName"
            label="Last Name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
            sx={{
              "& .MuiInputBase-input": {
                "&:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px rgba(25, 118, 210, 0.04) inset",
                  WebkitTextFillColor: "rgba(0, 0, 0, 0.87)",
                  caretColor: "rgba(0, 0, 0, 0.87)",
                  transition: "background-color 5000s ease-in-out 0s",
                  "&:hover": {
                    WebkitBoxShadow:
                      "0 0 0 100px rgba(25, 118, 210, 0.08) inset",
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
        </Grid>
      </Grid>

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

      <TextField
        margin="normal"
        fullWidth
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm Password"
        type={showConfirmPassword ? "text" : "password"}
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.confirmPassword &&
          Boolean(formik.errors.confirmPassword)
        }
        helperText={
          formik.touched.confirmPassword && formik.errors.confirmPassword
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle confirm password visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

      <FormControl fullWidth margin="normal">
        <InputLabel id="role-label">Role</InputLabel>
        <Select
          labelId="role-label"
          id="role"
          name="role"
          value={formik.values.role}
          label="Role"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.role && Boolean(formik.errors.role)}
        >
          <MenuItem value="PATIENT">Patient</MenuItem>
          <MenuItem value="DOCTOR">Doctor</MenuItem>
        </Select>
      </FormControl>

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
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Create Account"
        )}
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
          Already have an account?{" "}
          <Link
            component={RouterLink}
            to="/login"
            sx={{
              fontWeight: 500,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};
