import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetFormByIdQuery } from './../features/forms/formsApi';
import { useSubmitResponseMutation } from './../features/responses/responsesApi';
import { type Answer, type Question } from './../types/index.ts';

// Material-UI Imports
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
} from '@mui/material';

const SubmitFormPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const { data: form, isLoading: isFormLoading, error: formError } = useGetFormByIdQuery(formId || '');
  const [submitResponse, { isLoading: isSubmitting, isSuccess: isSubmitSuccess, error: submitError }] = useSubmitResponseMutation();

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (form && !isSubmitted) {
      // Initialize answers state based on form questions
      const initialAnswers: Answer[] = form.questions.map(q => ({
        questionId: q.id,
        answerText: q.type === 'text' ? '' : undefined,
        selectedOptions: q.type === 'multiple-choice' ? [] : undefined,
      }));
      setAnswers(initialAnswers);
    }
  }, [form, isSubmitted]);

  useEffect(() => {
    if (isSubmitSuccess) {
      showSnackbar('Thank you! Your feedback has been submitted successfully.', 'success');
      setIsSubmitted(true);
    }
    if (submitError) {
      showSnackbar(`Error submitting feedback: ${(submitError as any).data?.message || (submitError as any).error}`, 'error');
    }
  }, [isSubmitSuccess, submitError]);

  const handleTextChange = (questionId: string, value: string) => {
    setAnswers(prevAnswers =>
      prevAnswers.map(ans =>
        ans.questionId === questionId ? { ...ans, answerText: value } : ans
      )
    );
  };

  const handleMultipleChoiceChange = (questionId: string, option: string, isChecked: boolean) => {
    setAnswers(prevAnswers =>
      prevAnswers.map(ans => {
        if (ans.questionId === questionId) {
          const currentOptions = ans.selectedOptions || [];
          return {
            ...ans,
            selectedOptions: isChecked
              ? [...currentOptions, option]
              : currentOptions.filter(opt => opt !== option),
          };
        }
        return ans;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId) return;

    // Client-side validation for required questions
    const validationErrors: string[] = [];
    form?.questions.forEach(q => {
      if (q.required) {
        const answer = answers.find(a => a.questionId === q.id);
        if (!answer || (q.type === 'text' && !answer.answerText?.trim()) || (q.type === 'multiple-choice' && (!answer.selectedOptions || answer.selectedOptions.length === 0))) {
          validationErrors.push(`"${q.questionText}" is a required question.`);
        }
      }
    });

    if (validationErrors.length > 0) {
      showSnackbar(`Please fill out all required fields:\n${validationErrors.join('\n')}`, 'error');
      return;
    }

    try {
      await submitResponse({ formId, answers }).unwrap();
    } catch (err) {
      console.error('Failed to submit response:', err);
    }
  };

  if (isFormLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <CircularProgress />
        <Typography variant="h6" color="text.secondary" sx={{ ml: 2 }}>Loading form...</Typography>
      </Box>
    );
  }

  if (formError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Alert severity="error" sx={{ fontSize: '1.25rem', fontWeight: '600' }}>
          Error: Form not found or could not be loaded.
        </Alert>
      </Box>
    );
  }

  if (!form) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Typography variant="h6" color="text.secondary">No form data available.</Typography>
      </Box>
    );
  }

  if (isSubmitted) {
    return (
      <Container component="main" maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3, width: '100%', textAlign: 'center' }}>
          <Typography variant="h4" component="h2" color="success.main" sx={{ mb: 2, fontWeight: 'bold' }}>
            Submission Successful!
          </Typography>
          <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
            {snackbarMessage}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            You can close this page now.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center', color: 'text.primary' }}>
          {form.title}
        </Typography>
        {form.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            {form.description}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mb: 4 }}>
            {form.questions.map((q: Question) => (
              <Paper key={q.id} elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" component="label" sx={{ mb: 2, display: 'block', fontWeight: 'medium' }}>
                  {q.questionText} {q.required && <span style={{ color: 'red' }}>*</span>}
                </Typography>
                {q.type === 'text' && (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Your answer here..."
                    value={answers.find(a => a.questionId === q.id)?.answerText || ''}
                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                    required={q.required}
                  />
                )}
                {q.type === 'multiple-choice' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {q.options?.map((option, optIndex) => (
                      <FormControlLabel
                        key={optIndex}
                        control={
                          <Checkbox
                            checked={answers.find(a => a.questionId === q.id)?.selectedOptions?.includes(option) || false}
                            onChange={(e) => handleMultipleChoiceChange(q.id, option, e.target.checked)}
                          />
                        }
                        label={<Typography variant="body1">{option}</Typography>}
                      />
                    ))}
                  </Box>
                )}
              </Paper>
            ))}
          </Box>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ px: 5, py: 1.5, fontSize: '1.2rem' }}
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={24} color="inherit" /> : null}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </Box>
        </Box>
      </Paper>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SubmitFormPage;
