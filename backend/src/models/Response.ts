import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for a single answer
export interface IAnswer {
  questionId: string; // Reference to the question ID from the Form
  answerText?: string; // For text answers
  selectedOptions?: string[]; // For multiple-choice answers (can select multiple if allowed)
}

// Define the Response document interface
export interface IResponse extends Document {
  form: mongoose.Types.ObjectId; // Reference to the Form this response belongs to
  answers: IAnswer[];
  submittedAt: Date;
}

// Define the Response schema
const ResponseSchema: Schema = new Schema({
  form: {
    type: Schema.Types.ObjectId,
    ref: 'Form', // References the Form model
    required: true,
  },
  answers: [
    {
      questionId: { type: String, required: true },
      answerText: { type: String, trim: true },
      selectedOptions: [{ type: String, trim: true }],
    },
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the Response model
export const Response = mongoose.model<IResponse>('Response', ResponseSchema);
