import React, { useState, useEffect } from "react";
import { useRegisterMutation } from "./../features/auth/authApi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "./../features/auth/authSlice";
import { type RootState } from "./../app/store";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Link as MuiLink,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [register, { isLoading, error, isSuccess, data }] =
    useRegisterMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [passwordMismatchError, setPasswordMismatchError] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setCredentials({ user: data, token: data.token }));
      navigate("/dashboard");
    }
  }, [isSuccess, data, navigate, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMismatchError(null);

    if (password !== confirmPassword) {
      setPasswordMismatchError("Passwords do not match!");
      return;
    }
    await register({ name, email, password });
  };

  return (
    
    <Container component="main" maxWidth={false} disableGutters sx={{ height: "100vh", display: 'flex' }}>
      {/* Left side - Application Info */}
      <Box
        sx={{
          flex: { sm: 4, md: 7 },
          background: "linear-gradient(45deg, #3498db 30%, #2c3e50 90%)",
          color: "white",
          display: { xs: "none", sm: "flex" },
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Join the Platform
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.8)' }}>
            Unlock powerful features by creating your account.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon sx={{ color: '#ecf0f1' }} />
              </ListItemIcon>
              <ListItemText primary="Create & Manage Feedback Forms" primaryTypographyProps={{ variant: 'h6' }} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon sx={{ color: '#ecf0f1' }} />
              </ListItemIcon>
              <ListItemText primary="Analyze Responses with Ease" primaryTypographyProps={{ variant: 'h6' }} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon sx={{ color: '#ecf0f1' }} />
              </ListItemIcon>
              <ListItemText primary="Export Data for Further Insights" primaryTypographyProps={{ variant: 'h6' }} />
            </ListItem>
             <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon sx={{ color: '#ecf0f1' }} />
              </ListItemIcon>
              <ListItemText primary="Collaborate with your Team" primaryTypographyProps={{ variant: 'h6' }} />
            </ListItem>
          </List>
        </Container>
      </Box>

      {/* Right side - Register Form */}
      <Box
        component={Paper}
        elevation={6}
        square
        sx={{
            flex: { xs: 1, sm: 8, md: 5 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
        }}
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: '100%',
            maxWidth: '400px'
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{ mb: 3, fontWeight: "bold", color: "text.primary" }}
          >
            Admin Register
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="outlined"
              sx={{ mb: 3 }}
              error={!!passwordMismatchError}
            />
            {passwordMismatchError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordMismatchError}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {(error as any).data?.message ||
                  "Registration failed. Please try again."}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ py: 1.5, mb: 2, fontSize: "1.1rem", bgcolor: '#3498db', '&:hover': { bgcolor: '#2980b9' } }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register"
              )}
            </Button>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <MuiLink
                  component="button"
                  type="button"
                  onClick={() => navigate("/login")}
                  variant="body2"
                  sx={{ fontWeight: "bold" }}
                >
                  Login here
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
