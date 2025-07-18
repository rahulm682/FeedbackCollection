import { Request, Response } from 'express';
import { Response as FeedbackResponse, IResponse } from '../models/Response';
import { Form, IForm } from '../models/Form';

// @desc    Submit a new response to a form
// @route   POST /api/responses
// @access  Public
export const submitResponse = async (req: Request, res: Response) => {
  const { formId, answers } = req.body;

  try {
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    for (const question of form.questions) {
        if (question.required) {
            const submittedAnswer = answers.find((ans: any) => ans.questionId === question.id);
            if (!submittedAnswer || (!submittedAnswer.answerText && (!submittedAnswer.selectedOptions || submittedAnswer.selectedOptions.length === 0))) {
                return res.status(400).json({ message: `Required question "${question.questionText}" is missing an answer.` });
            }
        }
    }

    const response = await FeedbackResponse.create({
      form: formId,
      answers,
    });
    res.status(201).json({ message: 'Feedback submitted successfully!', responseId: response._id });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
