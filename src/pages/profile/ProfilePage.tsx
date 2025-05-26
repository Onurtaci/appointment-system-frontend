import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFormattedErrorMessage,
  getHttpErrorMessage,
} from "../../common/constants/errorMessages";
import { userService, UserServiceError } from "../../services/userService";
import type { AppDispatch, RootState } from "../../store";
import { updateUser } from "../../store/slices/authSlice";

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setError(null);
      setLoading(true);

      // Update user profile
      const updatedUser = await userService.updateUser(user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });

      // Update user in Redux store
      await dispatch(updateUser(updatedUser)).unwrap();

      setIsEditing(false);
    } catch (err: unknown) {
      console.error("Failed to update profile:", err);
      if (err instanceof UserServiceError) {
        setError(err.message);
      } else if (err instanceof AxiosError) {
        const status = err.response?.status;
        const errorData = err.response?.data;
        setError(getHttpErrorMessage(status || 500, errorData?.message));
      } else {
        setError(getFormattedErrorMessage("NETWORK", "UNKNOWN"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current user data
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    });
    setError(null);
    setIsEditing(false);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Profile Information
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  disabled={!isEditing || loading}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  disabled={!isEditing || loading}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  disabled={!isEditing || loading}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                {!isEditing ? (
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                    disabled={loading}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={loading}
                      sx={{ mr: 1 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                )}
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
