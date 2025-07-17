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
      admin: req.user.id, // Get admin ID from authenticated user
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
// @access  Private (Admin)
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

// @desc    Get a single form by ID (public access for submission)
// @route   GET /api/forms/:id
// @access  Public
export const getFormById = async (req: Request, res: Response) => {
  try {
    const form = await Form.findById(req.params.id).select('-admin'); // Don't expose admin ID
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get responses for a specific form (Admin only)
// @route   GET /api/forms/:formId/responses
// @access  Private (Admin)
export const getFormResponses = async (req: Request, res: Response) => {
  try {
    const formId = req.params.formId;
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authorized, user ID missing' });
    }

    // Verify that the form belongs to the authenticated admin
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
