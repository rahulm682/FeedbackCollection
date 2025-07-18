import { Request, Response } from 'express';
import { Form, IForm } from '../models/Form';
import { Response as FeedbackResponse, IResponse } from '../models/Response';

// @desc    Create a new form
// @route   POST /api/forms
// @access  Private (Admin)
export const createForm = async (req: Request, res: Response) => {
  const { title, description, questions } = req.body;

  try {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authorized, user ID missing' });
    }
    const form = await Form.create({
      admin: req.user.id,
      title,
      description,
      questions,
    });
    res.status(201).json(form);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all forms for an admin
// @route   GET /api/forms
// @access  Private
export const getAdminForms = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authorized, user ID missing' });
    }
    const forms = await Form.find({ admin: req.user.id }).sort({ createdAt: -1 });
    res.json(forms);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single form by ID
// @route   GET /api/forms/:id
// @access  Public
export const getFormById = async (req: Request, res: Response) => {
  try {
    const form = await Form.findById(req.params.id).select('-admin');
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get responses for a specific form 
// @route   GET /api/forms/:formId/responses
// @access  Private
export const getFormResponses = async (req: Request, res: Response) => {
  try {
    const formId = req.params.formId;
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authorized, user ID missing' });
    }

    const form = await Form.findOne({ _id: formId, admin: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Form not found or you are not authorized to view its responses' });
    }

    const responses = await FeedbackResponse.find({ form: formId }).sort({ submittedAt: -1 });
    res.json(responses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export responses for a specific form as CSV
// @route   GET /api/forms/:formId/responses/export-csv
// @access  Private
export const exportFormResponsesCsv = async (req: Request, res: Response) => {
  try {
    const formId = req.params.formId;
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized, user ID missing' });
    }

    const form = await Form.findOne({ _id: formId, admin: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Form not found or you are not authorized to export its responses' });
    }

    const responses = await FeedbackResponse.find({ form: formId }).sort({ submittedAt: 1 });

    if (responses.length === 0) {
      return res.status(404).json({ message: 'No responses found for this form to export.' });
    }

    // --- CSV Generation Logic ---
    const headers = ['Submission Time', ...form.questions.map(q => `"${q.questionText.replace(/"/g, '""')}"`)];
    let csv = headers.join(',') + '\n';

    responses.forEach(response => {
      const row: string[] = [];
      row.push(`"${new Date(response.submittedAt).toLocaleString().replace(/"/g, '""')}"`);

      form.questions.forEach(question => {
        const answer = response.answers.find(a => a.questionId === question.id);
        let answerValue = '';

        if (answer) {
          if (question.type === 'text') {
            answerValue = answer.answerText || '';
          } else if (question.type === 'multiple-choice') {
            answerValue = answer.selectedOptions?.join('; ') || '';
          }
        }
        row.push(`"${answerValue.replace(/"/g, '""')}"`);
      });
      csv += row.join(',') + '\n';
    });

    // Set headers for CSV download
    res.header('Content-Type', 'text/csv');
    res.attachment(`${form.title.replace(/[^a-z0-9]/gi, '_')}_responses.csv`);
    res.send(csv);

  } catch (error: any) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ message: 'Server error during CSV export.', error: error.message });
  }
};
