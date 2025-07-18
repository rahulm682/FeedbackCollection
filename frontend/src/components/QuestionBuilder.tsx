import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { type Question } from '../types/index.ts';

interface QuestionBuilderProps {
  question: Question;
  index: number;
  onUpdate: (index: number, field: keyof Question, value: any) => void;
  onRemove: (index: number) => void;
  onAddOption: (questionIndex: number) => void;
  onUpdateOption: (questionIndex: number, optionIndex: number, value: string) => void;
  onRemoveOption: (questionIndex: number, optionIndex: number) => void;
}

const QuestionBuilder: React.FC<QuestionBuilderProps> = ({
  question,
  index,
  onUpdate,
  onRemove,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}) => {
  return (
    <Box sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium' }}>
          Question {index + 1}
        </Typography>
        <IconButton color="error" onClick={() => onRemove(index)}>
          <DeleteIcon />
        </IconButton>
      </Box>

      <TextField
        fullWidth
        label="Question Text"
        variant="outlined"
        value={question.questionText}
        onChange={(e) => onUpdate(index, 'questionText', e.target.value)}
        required
        sx={{ mb: 2 }}
      />

      {question.type === 'multiple-choice' && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>Options</Typography>
          {question.options?.map((option, optIndex) => (
            <Box key={optIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder={`Option ${optIndex + 1}`}
                value={option}
                onChange={(e) => onUpdateOption(index, optIndex, e.target.value)}
                required
                sx={{ mr: 1 }}
              />
              {question.options!.length > 1 && (
                <IconButton size="small" onClick={() => onRemoveOption(index, optIndex)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}
          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => onAddOption(index)}
            sx={{ mt: 1 }}
          >
            Add Option
          </Button>
        </Box>
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={question.required}
            onChange={(e) => onUpdate(index, 'required', e.target.checked)}
          />
        }
        label="Required Question"
      />
    </Box>
  );
};

export default QuestionBuilder;
