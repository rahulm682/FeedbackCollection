import React, { useState, useEffect } from "react";
import { useLoginMutation } from "./../features/auth/authApi";
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

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error, isSuccess, data }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

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
    await login({ email, password });
  };

  return (
    <Container component="main" maxWidth={false} disableGutters sx={{ height: "100vh", display: 'flex' }}>
      {/* Left side - Application Info */}
      <Box
        sx={{
          flex: { sm: 4, md: 7 },
          background: "linear-gradient(45deg, #2c3e50 30%, #3498db 90%)",
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
            Feedback Collection Platform
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.8)' }}>
            Streamline your feedback process with powerful, intuitive tools.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon sx={{ color: '#ecf0f1' }} />
              </ListItemIcon>
              <ListItemText primary="Dynamic Form Builder" primaryTypographyProps={{ variant: 'h6' }} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon sx={{ color: '#ecf0f1' }} />
              </ListItemIcon>
              <ListItemText primary="Real-time Response Tracking" primaryTypographyProps={{ variant: 'h6' }} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon sx={{ color: '#ecf0f1' }} />
              </ListItemIcon>
              <ListItemText primary="In-depth Analytics & CSV Export" primaryTypographyProps={{ variant: 'h6' }} />
            </ListItem>
             <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon sx={{ color: '#ecf0f1' }} />
              </ListItemIcon>
              <ListItemText primary="Secure & Role-Based Access" primaryTypographyProps={{ variant: 'h6' }} />
            </ListItem>
          </List>
        </Container>
      </Box>

      {/* Right side - Login Form */}
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
            Login
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              sx={{ mb: 3 }}
            />
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {(error as any).data?.message ||
                  "Login failed. Please check your credentials."}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ py: 1.5, mb: 2, fontSize: "1.1rem", bgcolor: '#2c3e50', '&:hover': { bgcolor: '#34495e' } }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <MuiLink
                  component="button"
                  type="button"
                  onClick={() => navigate("/register")}
                  variant="body2"
                  sx={{ fontWeight: "bold" }}
                >
                  Register here
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
