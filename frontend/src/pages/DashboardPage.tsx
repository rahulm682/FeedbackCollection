import React, { useEffect } from "react";
import { useGetAdminFormsQuery } from "./../features/forms/formsApi";

// Material-UI Imports
import {
  Box,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";

// Import the new FormCard component
import FormCard from "../components/FormCard";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

const DashboardPage: React.FC = () => {
  const { data: forms, isLoading, error, refetch } = useGetAdminFormsQuery();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Effect to refetch forms when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      refetch(); // Force a refetch of forms when user logs in/out/registers
    }
  }, [isAuthenticated, refetch]); // Depend on isAuthenticated and refetch

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", color: "text.primary" }}
        >
          Admin Dashboard
        </Typography>
      </Box>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
          <Typography variant="h6" color="text.secondary" sx={{ ml: 2 }}>
            Loading forms...
          </Typography>
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 4 }}>
          Error loading forms:{" "}
          {(error as any).message || "An unknown error occurred."}
        </Alert>
      )}

      {!isLoading && !error && forms && forms.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No forms created yet. Click "Create New Form" to get started!
          </Typography>
        </Box>
      )}

      {!isLoading && !error && forms && forms.length > 0 && (
        <Grid container spacing={3}>
          {forms.map((form) => (
            <Grid item xs={12} sm={6} md={4} key={form._id}>
              <FormCard form={form} /> {/* Using the new FormCard component */}
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default DashboardPage;
