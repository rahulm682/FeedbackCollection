import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for a single question
export interface IQuestion {
  id: string; // Unique ID for the question within the form
  type: 'text' | 'multiple-choice';
  questionText: string;
  options?: string[]; // For multiple-choice questions
  required: boolean;
}

// Define the Form document interface
export interface IForm extends Document {
  admin: mongoose.Types.ObjectId; // Reference to the Admin User who created the form
  title: string;
  description?: string;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the Form schema
const FormSchema: Schema = new Schema({
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User', // References the User model
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  questions: [
    {
      id: { type: String, required: true }, // Client-generated ID for easier management
      type: { type: String, enum: ['text', 'multiple-choice'], required: true },
      questionText: { type: String, required: true, trim: true },
      options: [{ type: String, trim: true }], // Array of strings for multiple-choice options
      required: { type: Boolean, default: false },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add a pre-save hook to update the `updatedAt` field
FormSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Export the Form model
export const Form = mongoose.model<IForm>('Form', FormSchema);
