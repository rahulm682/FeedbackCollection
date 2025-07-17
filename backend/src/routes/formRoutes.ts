import express from 'express';
import { createForm, getAdminForms, getFormById, getFormResponses } from '../controllers/formController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createForm); // Admin only
router.get('/', protect, getAdminForms); // Admin only
router.get('/:id', getFormById); // Public
router.get('/:formId/responses', protect, getFormResponses); // Admin only

export default router;
