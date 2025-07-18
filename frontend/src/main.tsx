import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store, type RootState } from "./app/store";
import { useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Navbar from "./components/Navbar";
import "./index.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CreateFormPage from "./pages/CreateFormPage";
import SubmitFormPage from "./pages/SubmitFormPage";
import ViewResponsesPage from "./pages/ViewResponsesPage";
import React, { useMemo } from "react";
import type { JSX } from "@emotion/react/jsx-runtime";
import { CircularProgress, Typography } from "@mui/material";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress sx={{ mb: 2 }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: "600", color: "text.secondary" }}
        >
          Loading...
        </Typography>
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: "Inter, sans-serif",
        },
        palette: {
          mode: themeMode,
          primary: {
            main: themeMode === "light" ? "#1976d2" : "#90caf9",
          },
          secondary: {
            main: themeMode === "light" ? "#dc004e" : "#f48fb1",
          },
          background: {
            default: themeMode === "light" ? "#f4f6f8" : "#121212",
            paper: themeMode === "light" ? "#ffffff" : "#1e1e1e",
          },
          text: {
            primary: themeMode === "light" ? "#212121" : "#ffffff",
            secondary: themeMode === "light" ? "#757575" : "#b0b0b0",
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: "none",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: 8,
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
          MuiAlert: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
          MuiSnackbar: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
        },
      }),
    [themeMode]
  );

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "background.default",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {isAuthenticated && <Navbar />}

          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/submit/:formId" element={<SubmitFormPage />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-form"
              element={
                <PrivateRoute>
                  <CreateFormPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/forms/:formId/responses"
              element={
                <PrivateRoute>
                  <ViewResponsesPage />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
