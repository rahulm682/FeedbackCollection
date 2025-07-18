import React, { useState } from "react";
import { useCreateFormMutation } from "./../features/forms/formsApi";
import { useNavigate } from "react-router-dom";
import { type Question } from "./../types/index.ts";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import QuestionBuilder from "../components/QuestionBuilder";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const CreateFormPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [noExpiry, setNoExpiry] = useState(true);
  const [createForm, { isLoading }] = useCreateFormMutation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const addQuestion = (type: "text" | "multiple-choice") => {
    setQuestions([
      ...questions,
      {
        id: uuidv4(), // unique ID for the question
        type,
        questionText: "",
        options: type === "multiple-choice" ? [""] : undefined,
        required: false,
      },
    ]);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    (newQuestions[index] as any)[field] = value;
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].type === "multiple-choice") {
      newQuestions[questionIndex].options?.push("");
    }
    setQuestions(newQuestions);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    if (
      newQuestions[questionIndex].type === "multiple-choice" &&
      newQuestions[questionIndex].options
    ) {
      newQuestions[questionIndex].options![optionIndex] = value;
    }
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    if (
      newQuestions[questionIndex].type === "multiple-choice" &&
      newQuestions[questionIndex].options
    ) {
      newQuestions[questionIndex].options = newQuestions[
        questionIndex
      ].options?.filter((_, i) => i !== optionIndex);
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showSnackbar("Form title is required.", "error");
      return;
    }
    if (questions.length === 0) {
      showSnackbar("Please add at least one question.", "error");
      return;
    }
    for (const q of questions) {
      if (!q.questionText.trim()) {
        showSnackbar("All questions must have text.", "error");
        return;
      }
      if (
        q.type === "multiple-choice" &&
        (!q.options ||
          q.options.length === 0 ||
          q.options.some((opt) => !opt.trim()))
      ) {
        showSnackbar(
          "Multiple choice questions must have at least one non-empty option.",
          "error"
        );
        return;
      }
    }

    // Validate expiry date if not "No Expiry"
    if (!noExpiry && !expiresAt) {
      showSnackbar(
        'Please select an expiry date or check "No Expiry".',
        "error"
      );
      return;
    }
    if (!noExpiry && expiresAt && expiresAt <= new Date()) {
      showSnackbar("Expiry date must be in the future.", "error");
      return;
    }

    try {
      await createForm({
        title,
        description,
        questions,
        expiresAt: noExpiry ? undefined : expiresAt?.toISOString(),
      }).unwrap();
      showSnackbar("Form created successfully!", "success");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to create form:", err);
      showSnackbar("Failed to create form. Please try again.", "error");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", mb: 4, color: "text.primary" }}
        >
          Create New Feedback Form
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Form Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Description (Optional)"
            variant="outlined"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 4 }}
          ></TextField>

          <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={noExpiry}
                  onChange={(e) => {
                    setNoExpiry(e.target.checked);
                    if (e.target.checked) setExpiresAt(null); // Clear date if no expiry
                  }}
                />
              }
              label="No Expiry"
            />
            {!noExpiry && (
              <DateTimePicker
                label="Expires At"
                value={expiresAt}
                onChange={(newValue) => setExpiresAt(newValue)}
                disablePast={true} // Only allow future dates/times
                sx={{ "& .MuiInputBase-root": { width: "100%" } }}
              />
            )}
          </Box>

          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: "bold", mb: 3, color: "text.secondary" }}
          >
            Questions
          </Typography>
          {questions.length === 0 && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Add questions to your form below.
            </Typography>
          )}

          <Box sx={{ mb: 4, display: "flex", flexDirection: "column", gap: 3 }}>
            {questions.map((q, qIndex) => (
              <QuestionBuilder
                key={q.id}
                question={q}
                index={qIndex}
                onUpdate={updateQuestion}
                onRemove={removeQuestion}
                onAddOption={addOption}
                onUpdateOption={updateOption}
                onRemoveOption={removeOption}
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => addQuestion("text")}
            >
              Add Text Question
            </Button>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => addQuestion("multiple-choice")}
            >
              Add Multiple Choice Question
            </Button>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate("/dashboard")}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isLoading ? "Creating Form..." : "Create Form"}
            </Button>
          </Box>
        </Box>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
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
    </Container>
  );
};

export default CreateFormPage;
