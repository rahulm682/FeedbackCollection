import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, type RootState } from './app/store'; // Import RootState
import { useSelector } from 'react-redux'; // Import useSelector for PrivateRoute

// Material-UI Imports
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

// Global CSS import (ensure this file exists and contains basic body styles if needed)
import './index.css';

// Import Navbar component
import Navbar from './components/Navbar';

// Import page components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateFormPage from './pages/CreateFormPage';
import SubmitFormPage from './pages/SubmitFormPage';
import ViewResponsesPage from './pages/ViewResponsesPage';
import React from 'react';
import type { JSX } from '@emotion/react/jsx-runtime';
import { CircularProgress, Typography } from '@mui/material';


// Define a custom Material-UI theme (optional, but good practice)
const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif', // Set Inter font for Material-UI components
  },
  palette: {
    primary: {
      main: '#1976d2', // Example primary color (blue)
    },
    secondary: {
      main: '#dc004e', // Example secondary color (red)
    },
    background: {
      default: '#f4f6f8', // Light gray background
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Apply rounded corners to all buttons
          textTransform: 'none', // Prevent uppercase text by default
        },
      },
    },
    MuiPaper: { // For components like Card, Dialog, etc.
      styleOverrides: {
        root: {
          borderRadius: 12, // Apply rounded corners to paper-based components
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8, // Apply rounded corners to text fields
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Apply rounded corners to cards
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Apply rounded corners to alerts
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Apply rounded corners to snackbars
        },
      },
    },
  },
});

// A simple PrivateRoute component to protect routes
const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: '600', color: 'text.secondary' }}>Loading...</Typography>
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Main App component that defines routes and includes Navbar
const App: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <BrowserRouter>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', fontFamily: 'Inter, sans-serif' }}>
        {/* Render Navbar only if authenticated */}
        {isAuthenticated && <Navbar />}

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/submit/:formId" element={<SubmitFormPage />} /> {/* Public route */}

          {/* Protected Admin Routes */}
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
          <Route path="/" element={<Navigate to="/dashboard" />} /> {/* Default redirect */}
        </Routes>
      </Box>
    </BrowserRouter>
  );
};


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* Wrap the entire application with Material-UI's ThemeProvider */}
      <ThemeProvider theme={theme}>
        {/* CssBaseline helps to kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <App /> {/* Render the main App component */}
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
