import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  useGetFormByIdQuery,
  useGetFormResponsesQuery,
} from "./../features/forms/formsApi";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  Snackbar,
} from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const ViewResponsesPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const { data: form, isLoading: isFormLoading, error: formError } = useGetFormByIdQuery(formId || '');
  const { data: responses, isLoading: isResponsesLoading, error: responsesError } = useGetFormResponsesQuery(formId || '');

  const [viewType, setViewType] = useState<'tabular' | 'summary'>('tabular');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const tabularData = useMemo(() => {
    if (!form || !responses || responses.length === 0) return null;

    const headers = ['Submission Time', ...form.questions.map(q => q.questionText)];
    const rows = responses.map(res => {
      const row: string[] = [new Date(res.submittedAt).toLocaleString()];
      form.questions.forEach(q => {
        const answer = res.answers.find(a => a.questionId === q.id);
        if (answer) {
          if (q.type === 'text') {
            row.push(answer.answerText || '');
          } else if (q.type === 'multiple-choice') {
            row.push(answer.selectedOptions?.join(', ') || '');
          }
        } else {
          row.push('');
        }
      });
      return row;
    });
    return { headers, rows };
  }, [form, responses]);

  const summaryData = useMemo(() => {
    if (!form || !responses || responses.length === 0) return null;

    const summary: { question: string; type: 'text' | 'multiple-choice'; data: any }[] = [];

    form.questions.forEach(q => {
      if (q.type === 'text') {
        const textAnswers = responses.map(res => {
          const answer = res.answers.find(a => a.questionId === q.id);
          return answer?.answerText || '';
        }).filter(text => text !== '');
        summary.push({ question: q.questionText, type: 'text', data: textAnswers });
      } else if (q.type === 'multiple-choice') {
        const optionCounts: { [key: string]: number } = {};
        q.options?.forEach(opt => (optionCounts[opt] = 0));

        responses.forEach(res => {
          const answer = res.answers.find(a => a.questionId === q.id);
          answer?.selectedOptions?.forEach(selectedOpt => {
            if (optionCounts.hasOwnProperty(selectedOpt)) {
              optionCounts[selectedOpt]++;
            }
          });
        });
        summary.push({ question: q.questionText, type: 'multiple-choice', data: optionCounts });
      }
    });
    return summary;
  }, [form, responses]);

  const handleExportCsv = async () => {
    if (!formId) {
      showSnackbar('Form ID is missing, cannot export CSV.', 'error');
      return;
    }
    const token = localStorage.getItem('token'); 
    if (!token) {
      showSnackbar('You must be logged in to export CSV.', 'error');
      return;
    }

    const exportUrl = `http://localhost:5000/api/forms/${formId}/responses/export-csv`;

    try {
      const response = await fetch(exportUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'text/csv',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Failed to download CSV: ${response.statusText}`;
        try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.message) {
                errorMessage = errorJson.message;
            }
        } catch (e) {
            errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${form?.title.replace(/[^a-z0-9]/gi, '_') || 'responses'}.csv`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      const blob = await response.blob(); 
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename; 
      document.body.appendChild(a);
      a.click(); 
      a.remove(); 
      window.URL.revokeObjectURL(url);

      showSnackbar('CSV export started successfully!', 'success');

    } catch (error: any) {
      console.error('Error downloading CSV:', error);
      showSnackbar(`Failed to download CSV: ${error.message}`, 'error');
    }
  };


  if (isFormLoading || isResponsesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <CircularProgress />
        <Typography variant="h6" color="text.secondary" sx={{ ml: 2 }}>Loading responses...</Typography>
      </Box>
    );
  }

  if (formError || responsesError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Alert severity="error" sx={{ fontSize: '1.25rem', fontWeight: '600' }}>
          Error: Could not load form or responses. {(formError as any)?.data?.message || (responsesError as any)?.data?.message}
        </Alert>
      </Box>
    );
  }

  if (!form) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Typography variant="h6" color="text.secondary">Form not found.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                Responses for: "{form.title}"
            </Typography>
            <Button
                variant="contained"
                color="success"
                startIcon={<FileDownloadIcon />}
                onClick={handleExportCsv}
                disabled={responses?.length === 0}
            >
                Export as CSV
            </Button>
        </Box>
        {form.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {form.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
          <Button
            variant={viewType === 'tabular' ? 'contained' : 'outlined'}
            onClick={() => setViewType('tabular')}
          >
            Tabular View
          </Button>
          <Button
            variant={viewType === 'summary' ? 'contained' : 'outlined'}
            onClick={() => setViewType('summary')}
          >
            Summary View
          </Button>
        </Box>

        {responses && responses.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="h6" color="text.secondary">No responses submitted for this form yet.</Typography>
          </Box>
        ) : (
          <>
            {viewType === 'tabular' && tabularData && (
              <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto' }}>
                <Table sx={{ minWidth: 650 }} aria-label="responses table">
                  <TableHead>
                    <TableRow>
                      {tabularData.headers.map((header, index) => (
                        <TableCell key={index} sx={{ fontWeight: 'bold', bgcolor: 'action.hover' }}>
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tabularData.rows.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {viewType === 'summary' && summaryData && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {summaryData.map((summaryItem, index) => (
                  <Paper key={index} elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                      {summaryItem.question}
                    </Typography>
                    {summaryItem.type === 'text' && (
                      <>
                        {summaryItem.data.length > 0 ? (
                          <List dense>
                            {summaryItem.data.map((answer: string, ansIndex: number) => (
                              <ListItem key={ansIndex} disablePadding>
                                <ListItemText primary={answer} />
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            No text answers for this question yet.
                          </Typography>
                        )}
                      </>
                    )}
                    {summaryItem.type === 'multiple-choice' && (
                      <List dense>
                        {Object.entries(summaryItem.data).map(([option, count]) => (
                          <ListItem key={option} disablePadding sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <ListItemText primary={option} />
                            <Typography variant="body2" color="text.secondary">
                              ({count} responses)
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Paper>
                ))}
              </Box>
            )}
          </>
        )}
      </Paper>
      
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ViewResponsesPage;
