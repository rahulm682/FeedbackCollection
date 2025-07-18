import React, { useEffect } from "react";
import { useGetAdminFormsQuery } from "./../features/forms/formsApi";
import {
  Box,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
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
  }, [isAuthenticated, refetch]);

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
          Dashboard
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
        <Grid container spacing={4}>
          {forms.map((form) => (
            <Box
              key={form._id}
              sx={{
                width: "100%",
                "@media (min-width:600px)": {
                  width: "75%",
                },
                "@media (min-width:900px)": {
                  width: "40%",
                },
                px: 1.5,
                py: 1.5,
              }}
            >
              <FormCard form={form} />
            </Box>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default DashboardPage;
