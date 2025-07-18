import React from 'react';
import { Card, CardContent, Typography, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';
import { type Form } from '../types/index.ts';

interface FormCardProps {
  form: Form;
}

const FormCard: React.FC<FormCardProps> = ({ form }) => {
  const navigate = useNavigate();
  const baseUrl = window.location.origin;

  const handleCopyLink = (formId: string) => {
    navigator.clipboard.writeText(`${baseUrl}/submit/${formId}`);
    alert('Link copied to clipboard!');
  };

  return (
    <Card sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
          {form.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '3em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {form.description || 'No description provided.'}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ mb: 2, display: 'block' }}>
          Created: {new Date(form.createdAt).toLocaleDateString()}
        </Typography>
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
    </Card>
  );
};

export default FormCard;
