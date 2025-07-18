import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { type Form } from "../types/index.ts";
import { useDeleteFormMutation } from "../features/forms/formsApi";

interface FormCardProps {
  form: Form;
}

const FormCard: React.FC<FormCardProps> = ({ form }) => {
  const navigate = useNavigate();
  const baseUrl = window.location.origin;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteForm, { isLoading: isDeleting }] = useDeleteFormMutation();

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleCopyLink = (formId: string) => {
    navigator.clipboard.writeText(`${baseUrl}/submit/${formId}`);
    showSnackbar("Link copied to clipboard!", "success");
  };

  const handleDeleteClick = () => {
    setConfirmDialogOpen(true); // Open confirmation dialog
  };

  const handleConfirmDelete = async () => {
    setConfirmDialogOpen(false); // Close dialog
    try {
      await deleteForm(form._id).unwrap();
      showSnackbar("Form deleted successfully!", "success");
      // No need to manually refetch, RTK Query's invalidatesTags will handle it
    } catch (error: any) {
      console.error("Failed to delete form:", error);
      showSnackbar(
        `Failed to delete form: ${error.data?.message || error.error}`,
        "error"
      );
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false); // Close dialog
  };

  // Helper to determine if the form is expired
  const isFormExpired = form.expiresAt
    ? new Date(form.expiresAt) < new Date()
    : false;

  return (
    <Card
      sx={{
        borderRadius: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{ fontWeight: "bold", mb: 1, flexGrow: 1 }}
          >
            {form.title}
          </Typography>
          {/* Delete Button */}
          <IconButton
            aria-label="delete form"
            onClick={handleDeleteClick}
            color="error"
            disabled={isDeleting}
            sx={{ ml: 1 }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            minHeight: "3em",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {form.description || "No description provided."}
        </Typography>
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ mb: 1, display: "block" }}
        >
          Created: {new Date(form.createdAt).toLocaleDateString()}
        </Typography>
        {form.expiresAt && (
          <Typography
            variant="caption"
            color={isFormExpired ? "error" : "text.secondary"}
            sx={{ mb: 2, display: "block" }}
          >
            Expires: {new Date(form.expiresAt).toLocaleDateString()}{" "}
            {isFormExpired && "(Expired)"}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 2 }}
          onClick={() => navigate(`/forms/${form._id}/responses`)}
        >
          View Responses ({form.questions.length} questions)
        </Button>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={`${baseUrl}/submit/${form._id}`}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleCopyLink(form._id)}
                  edge="end"
                  title="Copy Link"
                >
                  <ContentCopyIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mt: 1 }}
        />
      </CardContent>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-delete-dialog-title"
        aria-describedby="confirm-delete-dialog-description"
      >
        <DialogTitle id="confirm-delete-dialog-title">
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-dialog-description">
            Are you sure you want to delete the form "{form.title}"? All
            associated responses will also be permanently deleted. This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            color="primary"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            autoFocus
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default FormCard;
